import  * as React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/hooks/use-language"

const { t } = useLanguage()

const InputPromptWindow = () => {
  const [points, setPoints] = React.useState(0);
  const handleInputChange = 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setPoints(Number(e.target.value));
  };

  return (
    <div className="flex flex-row">
      <Input 
        name="points"
        type="number"
        value={points}
        id="pointsInput" 
        onChange={ handleInputChange }
      />
      
      <Button onClick={() => {
        console.log(points)
      }} >
        {t.save}
      </Button>
    </div>
  );
};

export { InputPromptWindow }