'use strict';

import Recorder from "./node-record";
import {SpeechClient} from "@google-cloud/speech";
import * as readline from "readline";
import {logger} from "./logger";
import {VoiceAssistant} from "./voice-assistant";
import {LanguageCode} from "./types/languageCodes";
async function main() {
	const vc = new VoiceAssistant({
		speechLanguageCode: LanguageCode.RU,
		textLanguageCode: LanguageCode.RU,
		microphone: new Recorder({
			recorder: "rec",
			audioType: "mp3",
			channels: 1,
			sampleRate: 48000
		}),
		transcribe: new SpeechClient()
	})
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	const handleInput = async (input: string) => {
		switch (input) {
			case 'v':
				if (!vc.isRecording) {
					vc.startRecording();
				}
				break;
			case 's':
				if (vc.isRecording) {
					const completionChunks = await vc.stopRecording();
					for await (const part of completionChunks) {
						process.stdout.write(part.choices[0]?.delta?.content || '');
					}
				}
				break;
			case 'q':
				if (vc.isRecording) {
					vc.stopRecording();
				}
				logger.warn('Exiting...');
				// Добавьте здесь логику для завершения приложения, если необходимо
				process.exit(0);
				break;
			default:
				printActions();
				break;
		}
	};
	printActions();
	rl.on('line', async (input) => {
		await handleInput(input);
	});
}

main();

function printActions(){
	logger.info("To record voice, enter 'v' on your keyboard");
	logger.info("To stop recording, enter 's' on your keyboard");
	logger.info("To quit, enter 'q'");
}