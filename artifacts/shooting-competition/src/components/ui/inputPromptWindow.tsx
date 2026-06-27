import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { useCompetitionData } from "@/hooks/use-competition-data";

type PromptState = {
  open: boolean;
  competitorId: string | null;
  compId: string | null;
  resolve: ((value: number | null) => void) | null;
  initialValue: number;
};

export const InputPromptWindow = () => {
  const { t } = useLanguage();
  const { updateScore } = useCompetitionData();

  const [state, setState] = React.useState<PromptState>({
    open: false,
    competitorId: null,
    compId: null,
    resolve: null,
    initialValue: 0,
  });

  const [points, setPoints] = React.useState(0);

  const openPrompt = (competitorId: string, compId: string, currentScore: number) => {
    return new Promise<number | null>((resolve) => {
      setPoints(currentScore);

      setState({
        open: true,
        competitorId,
        compId,
        resolve,
        initialValue: currentScore,
      });
    });
  };

  // expose globally (simple hack for your existing code)
  React.useEffect(() => {
    (window as any).InputPromptSetter = openPrompt;
  }, []);

  const close = () => {
    setState((s) => ({ ...s, open: false }));
  };

  const save = () => {
    state.resolve?.(points);
    close();
  };

  const cancel = () => {
    state.resolve?.(null);
    close();
  };

  if (!state.open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-secondary rounded-lg outline outline-2 outline-primary">

        <h3>{t.scorePrompt}</h3>

        <Input
          type="number"
          value={points}
          min={0}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="bg-background mb-2"
        />

        <div className="flex gap-2">
          <Button onClick={save}>{t.save}</Button>
          <Button variant="outline" onClick={cancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};