// @flow
import AttackBot from './bots/AttackBot';
import { terminal } from 'terminal-kit';
import config from '../generals-config.json';
import shortid from 'shortid';
import TerminalViewer from './viewer/TerminalViewer';
import { playRepeatedly } from './client/index';

const botId = config.botId || shortid();
const botName = '[Bot] ' + (config.botName || shortid());
const gameId = config.gameId || shortid();

playRepeatedly(botId, botName, gameId, new TerminalViewer(), (gameState) => new AttackBot(gameState));
