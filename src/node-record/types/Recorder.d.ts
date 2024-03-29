/**
 * Интерфейс `RecorderOptions` представляет собой структуру параметров для настройки записи аудио.
 */
export interface RecorderOptions {
    /**
     * Частота дискретизации аудио (количество выборок в секунду).
     * Default - 16000
     */
    sampleRate?: number;

    /**
     * Количество аудио каналов (обычно 1 для моно и 2 для стерео).
     * Default - 1
     */
    channels?: 1 | 2;

    /**
     * Определяет, будет ли произведено сжатие аудио.
     * Default - false
     */
    compress?: boolean;

    /**
     * Пороговое значение тишины для автоматической остановки записи (только для записи). Значение от 0 до 1
     * Default - 0.5
     */
    threshold?: number;

    /**
     * Автоматическая остановка записи при обнаружении тишины (если поддерживается).
     * Default - false
     */
    endOnSilence?: boolean;
    /**
     * Длительность тишины в секундах перед автоматической остановкой записи. Значение от 0.0 до 1.0
     * Default - 1.0
     */
    silence?: number;

    /**
     * Записывающее устройство по умолчанию (например, 'sox').
     * Default - 'sox'
     */
    recorder?: 'sox' | 'rec' | 'arecord';

    /**
     * Тип аудиофайла для записи (по умолчанию 'wav').
     */
    audioType?: 'wav' | 'mp3' | 'flac';
    /**
     *  ...
     * */
    device?: null
    /**
     * Данные поля используются для пороговово значения тишины для автоматической остановки записи, не трогать их
     */
    thresholdStart?: null,
    thresholdEnd?: null,
}
