import { create } from "zustand";
import { persist } from "zustand/middleware";

type SinglePlayerState = {
  playerSign: "X" | "O" | null;
  playerTurn: boolean;
  board: ("X" | "O" | null)[];
  winner: "X" | "O" | "draw" | null;
  setPlayerSign: (value: "X" | "O" | null) => void;
  setBox: (index: number, sign: "X" | "O" | null) => void;
  setWinner: (value: "X" | "O" | "draw" | null) => void;
  setPlayerTurn: (value: boolean) => void;
  botMove: () => void;
  resetSinglePlayer: () => void;
  reset: () => void;
};

export const useSinglePlayer = create<SinglePlayerState>()(
  persist(
    (set) => ({
      playerSign: null,
      playerTurn: true,
      board: Array(9).fill(null),
      winner: null,
      setPlayerSign: (val) => set({ playerSign: val }),
      setBox: (index, sign) =>
        set((state) => {
          const newBoard = [...state.board];
          newBoard[index] = sign;
          return { board: newBoard };
        }),
      setWinner: (val) => set({ winner: val }),
      setPlayerTurn: (val) => set({ playerTurn: val }),
      botMove: () =>
        set((state) => {
          const availableGridCells = state.board
            .map((value, index) => (value === null ? index : null))
            .filter((index): index is number => index !== null);

          if (availableGridCells.length > 0) {
            setTimeout(() => {
              const randomBoardCell =
                availableGridCells[
                  Math.floor(Math.random() * availableGridCells.length)
                ];
              const botSign = state.playerSign === "X" ? "O" : "X";

              set((state) => {
                const updatedBoard = [...state.board];
                updatedBoard[randomBoardCell] = botSign;
                return { board: updatedBoard };
              });

              set({ playerTurn: true });
            }, 1000);
          }

          return state;
        }),
      resetSinglePlayer: () =>
        set({
          playerSign: null,
          board: Array(9).fill(null),
          winner: null,
          playerTurn: true,
        }),
      reset: () =>
        set({
          playerSign: null,
          board: Array(9).fill(null),
          winner: null,
          playerTurn: true,
        }),
    }),
    {
      name: "single-game-storage",
    }
  )
);