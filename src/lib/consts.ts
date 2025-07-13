import { SeasonalEmoteButton, SeasonalEmoteButtonTypes } from './types';

export const botChatroomdId = '408830844350771200';

const currentDate = new Date();
const currentDateYear = currentDate.getFullYear();
const seasonalEmoteButtonTypes = [
  {
    type: SeasonalEmoteButtonTypes.NewYears,
    startDate: new Date(
      currentDate.getMonth() === 0 ? currentDateYear - 1 : currentDateYear,
      11,
      29
    ),
    endDate: new Date(currentDate.getMonth() === 0 ? currentDateYear : currentDateYear + 1, 0, 2)
  },
  {
    type: SeasonalEmoteButtonTypes.Easter,
    startDate: new Date(currentDateYear, 2, 22),
    endDate: new Date(currentDateYear, 3, 26)
  },
  {
    type: SeasonalEmoteButtonTypes.Halloween,
    startDate: new Date(currentDateYear, 9, 1),
    endDate: new Date(currentDateYear, 10, 2)
  },
  {
    type: SeasonalEmoteButtonTypes.Christmas,
    startDate: new Date(currentDateYear, 11, 1),
    endDate: new Date(currentDateYear, 11, 29)
  }
];

export const currentSeasonalEmoteButtonType =
  seasonalEmoteButtonTypes.find((seasonalEmoteButton) => {
    const currentDate = new Date().getTime();

    return (
      currentDate >= seasonalEmoteButton.startDate.getTime() &&
      currentDate <= seasonalEmoteButton.endDate.getTime()
    );
  }) ??
  ({
    type: SeasonalEmoteButtonTypes.Default,
    startDate: new Date(currentDateYear, 0, 1),
    endDate: new Date(currentDateYear, 0, 1)
  } as SeasonalEmoteButton);
