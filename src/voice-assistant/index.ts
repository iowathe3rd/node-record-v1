import {SpeechClient} from '@google-cloud/speech';
import Recorder from '../node-record';
import {logger} from '../logger';
import {LanguageCode} from '../types/languageCodes';
import {google} from '@google-cloud/speech/build/protos/protos';
import {openai} from '../gpt';
import AudioEncoding = google.cloud.speech.v1p1beta1.RecognitionConfig.AudioEncoding;

export interface VoiceAssistantOptions {
    transcribe: SpeechClient,
    microphone: Recorder,
    textLanguageCode: LanguageCode,
    speechLanguageCode: LanguageCode
}
export class VoiceAssistant {
	get isRecording(): boolean {
		return this._isRecording;
	}
	set isRecording(value: boolean) {
		this._isRecording = value;
	}
	get transcriptionResult(): string {
		return this._transcriptionResult;
	}
	set transcriptionResult(value: string) {
		this._transcriptionResult = value;
	}
	private transcribe: SpeechClient;
	private microphone: Recorder;
	private _transcriptionResult: string
	public speechLanguageCode: LanguageCode;
	public textLanguageCode: LanguageCode;
	private _isRecording: boolean;
	constructor({
		transcribe,
		microphone,
		textLanguageCode,
		speechLanguageCode,
	}: VoiceAssistantOptions) {
		this.transcribe = transcribe;
		this.microphone = microphone;
		this.speechLanguageCode = speechLanguageCode;
		this.textLanguageCode = textLanguageCode;
		this._isRecording = false;
		this._transcriptionResult = '';
	}
	public startRecording(): void{
		logger.info('Recording started');
		const transcribeStream = this.transcribe.streamingRecognize({
			config: {
				encoding: AudioEncoding.MP3,
				languageCode: this.speechLanguageCode,
				model: 'latest_short',
				maxAlternatives: 1,
				sampleRateHertz: 48000,
			},
			interimResults: true,
			voiceActivityTimeout: {
				speechEndTimeout: {
					seconds: 5
				}
			},
			enableVoiceActivityEvents: true
		})
		transcribeStream.on('error', (err)=> {
			logger.fatal(err);
		})
		transcribeStream.on('data', data => {
			if (data.results[0] && data.results[0].alternatives[0]){
				this.transcriptionResult = data.results[0].alternatives[0].transcript;
			}
		})
		const microphoneStream = this.microphone.start().stream();
		if(!microphoneStream){
			logger.fatal('Failed to start recording. Audio device input stream is missing.')
			throw new Error
		}
		microphoneStream.pipe(transcribeStream);
		this._isRecording = true;
	}
	public async stopRecording(){
		logger.debug(this.transcriptionResult)
		logger.info('Stop recording');
		this.microphone.stop();
		this.isRecording = false;
		return openai.chat.completions.create({
			stream: true,
			model: 'gpt-4',
			temperature: 1,
			messages: [
				{
					content: this.transcriptionResult,
					role: 'user',
				}
			]
		});
	}
}