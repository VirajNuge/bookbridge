import React from "react";
import "./bookcal.css";
import { useState } from "react";

const CalculateBookWorth = () => {
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [daysUsed, setDaysUsed] = useState<number>(0);
  const [pagesRemoved, setPagesRemoved] = useState<number>(0);
  const [coverCondition, setCoverCondition] = useState<string>("Excellent");
  const [lookCondition, setLookCondition] = useState<string>("Excellent");
  const [bindingCondition, setBindingCondition] = useState<string>("Intact");
  const [highlighting, setHighlighting] = useState<string>("None");
  const [bookValue, setBookValue] = useState<number | null>(null);

  const calculateBookValue = () => {
    // Depreciation based on days used
    let daysDepreciation = 0;
    if (daysUsed <= 30) {
      daysDepreciation = 0.05;
    } else if (daysUsed <= 90) {
      daysDepreciation = 0.15;
    } else {
      daysDepreciation = 0.3;
    }

    // Depreciation based on pages removed
    const pageDepreciation = pagesRemoved * 0.01;

    // Condition depreciation (Cover, Look, Binding)
    const conditionDepreciation = {
      cover: { Excellent: 0, Good: 0.1, Fair: 0.25, Poor: 0.5 }[coverCondition] ?? 0,
      look: { Excellent: 0, Good: 0.1, Fair: 0.25, Poor: 0.5 }[lookCondition] ?? 0,
      binding: { Intact: 0, Loose: 0.15, Damaged: 0.3 }[bindingCondition] ?? 0,
    };
    
    const highlightingDepreciation =
      { None: 0, Minor: 0.1, Significant: 0.25 }[highlighting] ?? 0;
    

    // Calculate the worth
    const adjustedPrice =
      originalPrice *
      (1 - daysDepreciation) *
      (1 - pageDepreciation) *
      (1 - conditionDepreciation.cover) *
      (1 - conditionDepreciation.look) *
      (1 - conditionDepreciation.binding) *
      (1 - highlightingDepreciation);

    setBookValue(Math.round(adjustedPrice * 100) / 100);
  };

  return (
    <div className="allinput">
      <div>
        <label>Original Price: </label>
        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Days Used: </label>
        <input
          type="number"
          value={daysUsed}
          onChange={(e) => setDaysUsed(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Pages Removed: </label>
        <input
          type="number"
          value={pagesRemoved}
          onChange={(e) => setPagesRemoved(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Cover Condition: </label>
        <select
          value={coverCondition}
          onChange={(e) => setCoverCondition(e.target.value)}
        >
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>
      <div>
        <label>Appearance Condition: </label>
        <select
          value={lookCondition}
          onChange={(e) => setLookCondition(e.target.value)}
        >
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>
      <div>
        <label>Binding Condition: </label>
        <select
          value={bindingCondition}
          onChange={(e) => setBindingCondition(e.target.value)}
        >
          <option value="Intact">Intact</option>
          <option value="Loose">Loose</option>
          <option value="Damaged">Damaged</option>
        </select>
      </div>
      <div>
        <label>Highlighting: </label>
        <select
          value={highlighting}
          onChange={(e) => setHighlighting(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Minor">Minor</option>
          <option value="Significant">Significant</option>
        </select>
      </div>
      <button className="buttoncal" onClick={calculateBookValue}>Calculate</button>

      {bookValue !== null && (
        <div>
          <h2>Estimated Worth: ${bookValue}</h2>
        </div>
      )}
    </div>
  );
};

export default CalculateBookWorth;
