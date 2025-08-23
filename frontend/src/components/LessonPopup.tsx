import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { type Lesson } from '../constants/mockData';

const { width } = Dimensions.get('window');

interface LessonPopupProps {
  visible: boolean;
  lesson: Lesson | null;
  onClose: () => void;
  onLearnMore: () => void;
}

const LessonPopup: React.FC<LessonPopupProps> = ({
  visible,
  lesson,
  onClose,
  onLearnMore,
}) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entry animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 1,
          delay: 200,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Bounce animation for dino
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim, bubbleAnim, bounceAnim]);

  if (!lesson) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.popupContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={28} color="#666" />
              </TouchableOpacity>

              {/* Dino Character */}
              <Animated.View
                style={[
                  styles.dinoContainer,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -8],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Surface style={styles.dinoCircle} elevation={4}>
                  <Text style={styles.dinoEmoji}>{lesson.dinoEmoji}</Text>
                  
                  <View style={styles.sparkle1}>
                    <Text style={styles.sparkleEmoji}>✨</Text>
                  </View>
                  <View style={styles.sparkle2}>
                    <Text style={styles.sparkleEmoji}>⭐</Text>
                  </View>
                </Surface>
              </Animated.View>

              {/* Speech Bubble */}
              <Animated.View
                style={[
                  styles.speechBubbleContainer,
                  {
                    opacity: bubbleAnim,
                    transform: [
                      {
                        scale: bubbleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Surface style={styles.speechBubble} elevation={4}>
                  {/* Bubble pointer */}
                  <View style={styles.bubblePointer} />
                  
                  {/* Content */}
                  <View style={styles.bubbleContent}>
                    {/* Lesson Title */}
                    <Text style={styles.lessonTitle}>
                      {t(lesson.titleKey)}
                    </Text>

                    {/* Letter Badge */}
                    <Surface style={styles.letterBadge} elevation={4}>
                      <Text style={styles.letterText}>{lesson.letter}</Text>
                    </Surface>

                    {/* Summary Text */}
                    <Text style={styles.summaryText}>
                      {t(`popup.summaries.${lesson.titleKey}`)}
                    </Text>

                    {/* Action Button */}
                    <TouchableOpacity
                      style={styles.learnMoreButton}
                      onPress={onLearnMore}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons 
                        name="rocket-launch" 
                        size={20} 
                        color="white" 
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.learnMoreText}>
                        {t('popup.startAdventure')}
                      </Text>
                    </TouchableOpacity>

                    {/* Status indicator */}
                    <View style={styles.statusContainer}>
                      <MaterialCommunityIcons 
                        name={
                          lesson.status === 'completed' 
                            ? 'check-circle' 
                            : lesson.status === 'current'
                            ? 'play-circle'
                            : 'lock'
                        } 
                        size={16} 
                        color={
                          lesson.status === 'completed' 
                            ? '#4CAF50' 
                            : lesson.status === 'current'
                            ? '#FF9800'
                            : '#999'
                        }
                      />
                      <Text style={[
                        styles.statusText,
                        { color: 
                          lesson.status === 'completed' 
                            ? '#4CAF50' 
                            : lesson.status === 'current'
                            ? '#FF9800'
                            : '#999'
                        }
                      ]}>
                        {lesson.status === 'completed' 
                          ? t('lessonStatus.mastered')
                          : lesson.status === 'current'
                          ? t('lessonStatus.readyToLearn')
                          : t('lessonStatus.comingSoon')
                        }
                      </Text>
                    </View>
                  </View>
                </Surface>
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  popupContainer: {
    alignItems: 'center',
    maxWidth: width * 0.9,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dinoContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  dinoCircle: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#2E7D32',
  },
  dinoEmoji: {
    fontSize: width * 0.12,
  },
  sparkle1: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
  sparkleEmoji: {
    fontSize: 16,
  },
  speechBubbleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    maxWidth: '100%',
    minWidth: width * 0.75,
    position: 'relative',
  },
  bubblePointer: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  bubbleContent: {
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 16,
  },
  letterBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  letterText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryText: {
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  learnMoreButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  learnMoreText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: width * 0.035,
    fontWeight: '500',
  },
});

export default LessonPopup;