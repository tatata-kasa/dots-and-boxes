declare module 'react-dice-complete' {
  import { ForwardRefExoticComponent, RefAttributes } from 'react';

  export interface ReactDiceRef {
    rollAll: (values?: number[]) => void;
  }

  export interface ReactDiceProps {
    numDice: number;
    rollDone: (total: number, values: number[]) => void;
    faceColor?: string;
    dotColor?: string;
    dieSize?: number;
    rollTime?: number;
    defaultRoll?: number;
    outline?: boolean;
    outlineColor?: string;
    disableIndividual?: boolean;
    disableRandom?: boolean;
    margin?: number;
  }

  const ReactDice: ForwardRefExoticComponent<ReactDiceProps & RefAttributes<ReactDiceRef>>;
  export default ReactDice;
}
