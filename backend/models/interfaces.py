import abc
import numpy as np
from typing import Union


class IASRModel(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'getTranscript') and
                callable(subclass.getTranscript) and
                hasattr(subclass, 'getWordLocations') and
                callable(subclass.getWordLocations) and
                hasattr(subclass, 'processAudio') and
                callable(subclass.processAudio))

    @abc.abstractmethod
    def getTranscript(self) -> str:
        """Get the transcripts of the processed audio"""
        raise NotImplementedError

    @abc.abstractmethod
    def getWordLocations(self) -> list:
        """Get the pair of words location from audio"""
        raise NotImplementedError

    @abc.abstractmethod
    def processAudio(self, audio: Union[np.ndarray, 'torch.Tensor']):
        """Process the audio"""
        raise NotImplementedError


class ITextToPhonemModel(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'convertToPhonem') and
                callable(subclass.convertToPhonem))

    @abc.abstractmethod
    def convertToPhonem(self, text: str) -> str:
        """Convert sentence to phonemes"""
        raise NotImplementedError
