import colors from 'ansi-256-colors';

export const RESET = colors.reset;

export const FOG_BG = colors.bg.getRgb(1, 1, 1);
export const OBSTACLE_BG = colors.bg.getRgb(3, 3, 3);
export const EMPTY_BG = colors.bg.getRgb(5, 5, 5);

export const PLAYER_0_BG = colors.bg.getRgb(5, 0, 0);
export const PLAYER_1_BG = colors.bg.getRgb(0, 0, 5);
export const PLAYER_2_BG = colors.bg.getRgb(0, 5, 5);
export const PLAYER_3_BG = colors.bg.getRgb(0, 5, 0);
export const PLAYER_4_BG = colors.bg.getRgb(5, 0, 5);
export const PLAYER_5_BG = colors.bg.getRgb(5, 5, 0);
export const PLAYER_6_BG = colors.bg.getRgb(5, 5, 5);
export const PLAYER_7_BG = colors.bg.getRgb(0, 0, 0);

export const PLAYER_0_FG = colors.fg.getRgb(5, 0, 0);
export const PLAYER_1_FG = colors.fg.getRgb(0, 0, 5);
export const PLAYER_2_FG = colors.fg.getRgb(0, 5, 5);
export const PLAYER_3_FG = colors.fg.getRgb(0, 5, 0);
export const PLAYER_4_FG = colors.fg.getRgb(5, 0, 5);
export const PLAYER_5_FG = colors.fg.getRgb(5, 5, 0);
export const PLAYER_6_FG = colors.fg.getRgb(5, 5, 5);
export const PLAYER_7_FG = colors.fg.getRgb(0, 0, 0);

export function getPlayerBg(playerIndex) {
  switch (playerIndex) {
    case 0:
      return PLAYER_0_BG;
    case 1:
      return PLAYER_1_BG;
    case 2:
      return PLAYER_2_BG;
    case 3:
      return PLAYER_3_BG;
    case 4:
      return PLAYER_4_BG;
    case 5:
      return PLAYER_5_BG;
    case 6:
      return PLAYER_6_BG;
    case 7:
      return PLAYER_7_BG;
  }
}

export function getPlayerFg(playerIndex) {
  switch (playerIndex) {
    case 0:
      return PLAYER_0_FG;
    case 1:
      return PLAYER_1_FG;
    case 2:
      return PLAYER_2_FG;
    case 3:
      return PLAYER_3_FG;
    case 4:
      return PLAYER_4_FG;
    case 5:
      return PLAYER_5_FG;
    case 6:
      return PLAYER_6_FG;
    case 7:
      return PLAYER_7_FG;
  }
}