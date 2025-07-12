-- Helper function to convert American odds text to a numeric profit multiplier.
-- e.g., +200 -> 2.0, -110 -> 0.909
CREATE OR REPLACE FUNCTION convert_american_to_profit_multiplier(odds_text TEXT)
RETURNS NUMERIC AS $$
DECLARE
    odds_num INT;
BEGIN
    -- Attempt to convert text to integer, handle potential errors
    BEGIN
        odds_num := odds_text::INT;
    EXCEPTION WHEN others THEN
        RETURN 0; -- Return 0 if conversion fails
    END;

    IF odds_num > 0 THEN
        RETURN odds_num / 100.0;
    ELSIF odds_num < 0 THEN
        RETURN 100.0 / -odds_num;
    ELSE
        RETURN 0; -- Should not happen with valid odds
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Main function to calculate and update stats for a single expert
CREATE OR REPLACE FUNCTION update_expert_stats(p_expert_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_calls INT;
    v_wins INT;
    v_losses INT;
    v_net_units NUMERIC;
    v_total_units_risked NUMERIC;
    v_win_rate NUMERIC;
    v_roi NUMERIC;
BEGIN
    -- Calculate stats from the calls table for settled bets
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'Won'),
        COUNT(*) FILTER (WHERE status = 'Lost'),
        COALESCE(SUM(
            CASE
                WHEN status = 'Won' THEN units * convert_american_to_profit_multiplier(odds)
                WHEN status = 'Lost' THEN -units
                ELSE 0 -- Push or Upcoming
            END
        ), 0),
        COALESCE(SUM(units), 0)
    INTO
        v_total_calls,
        v_wins,
        v_losses,
        v_net_units,
        v_total_units_risked
    FROM
        calls
    WHERE
        expert_id = p_expert_id
        AND status IN ('Won', 'Lost', 'Push');

    -- Calculate Win Rate, avoiding division by zero
    IF (v_wins + v_losses) > 0 THEN
        v_win_rate := (v_wins::NUMERIC / (v_wins + v_losses)) * 100.0;
    ELSE
        v_win_rate := 0;
    END IF;

    -- Calculate ROI, avoiding division by zero
    IF v_total_units_risked > 0 THEN
        v_roi := (v_net_units / v_total_units_risked) * 100.0;
    ELSE
        v_roi := 0;
    END IF;

    -- Update the experts table
    UPDATE experts
    SET
        total_calls = v_total_calls,
        win_rate = v_win_rate,
        total_units = v_net_units,
        roi = v_roi
    WHERE
        id = p_expert_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function that calls the main update function
CREATE OR REPLACE FUNCTION handle_call_change()
RETURNS TRIGGER AS $$
BEGIN
    -- When a call is inserted or updated, update stats for the new expert_id
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.expert_id IS NOT NULL THEN
        PERFORM update_expert_stats(NEW.expert_id);
    END IF;

    -- When a call is deleted or the expert_id is changed, update stats for the old expert_id
    IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') AND OLD.expert_id IS NOT NULL THEN
        -- Ensure we don't run it twice for the same expert if expert_id didn't change
        IF (TG_OP = 'DELETE' OR NEW.expert_id IS DISTINCT FROM OLD.expert_id) THEN
             PERFORM update_expert_stats(OLD.expert_id);
        END IF;
    END IF;

    RETURN NULL; -- The result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger to avoid errors on re-run
DROP TRIGGER IF EXISTS on_call_change ON calls;

-- Create the trigger to fire after any change to the calls table
CREATE TRIGGER on_call_change
AFTER INSERT OR UPDATE OR DELETE ON calls
FOR EACH ROW EXECUTE FUNCTION handle_call_change();
