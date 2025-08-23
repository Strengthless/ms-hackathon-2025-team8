import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { 
  Text, 
  Surface 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { 
  users, 
  footprintPatterns, 
  lessonPositions, 
  localizedLessons, 
  type LessonStatus,
  type Lesson 
} from '../constants/mockData';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const user = users[0];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const titleGlow = useRef(new Animated.Value(0)).current;
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for current lesson
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(titleGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, pulseAnim, titleGlow]);

  const startPronunciation = (lesson: Lesson) => {
    if (lesson.status === 'locked') {
      Alert.alert(
        t('alerts.adventureLocked.title'),
        t('alerts.adventureLocked.message'),
        [{ text: t('alerts.adventureLocked.button') }]
      );
      return;
    }

    const lessonTitle = t(lesson.titleKey);
    Alert.alert(
      t('alerts.startAdventure.title', { lessonTitle }),
      t('alerts.startAdventure.message'),
      [
        { text: t('alerts.startAdventure.cancelButton'), style: 'cancel' },
        { 
          text: t('alerts.startAdventure.confirmButton'), 
          onPress: () => {
            if (navigation) {
              // navigation.navigate('PronunciationPractice', { lesson });
            }
            console.log(t('console.startingAdventure'), lesson.letter);
          }
        }
      ]
    );
  };

  const getStatusStyle = (status: LessonStatus, isHovered: boolean = false) => {
    let baseStyle;
    
    switch (status) {
      case 'completed':
        baseStyle = styles.completed;
        break;
      case 'current':
        baseStyle = styles.current;
        break;
      case 'locked':
        baseStyle = styles.locked;
        break;
      default:
        baseStyle = styles.locked;
    }

    return [
      baseStyle,
      isHovered && status !== 'locked' && styles.hovered
    ];
  };

  const getFootprintPosition = (index: number): { 
    footprints: { offsetX: number; offsetY: number; rotation: string }[] 
  } => {
    const stepInWeek = index % 6;
    const patternIndex = stepInWeek % 5;
    const pattern = footprintPatterns[patternIndex];
    
    return {
      footprints: pattern.footprints.map(fp => ({
        offsetX: fp.offsetX * width,
        offsetY: fp.offsetY,
        rotation: fp.rotation
      }))
    };
  };

  const renderFootprint = (index: number) => {
    const position = getFootprintPosition(index);
    
    return (
      <View style={styles.footprintGroupContainer}>
        {position.footprints.map((footprint, footprintIndex) => (
          <Animated.View 
            key={footprintIndex}
            style={[
              styles.footprintContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateX: footprint.offsetX },
                  { translateY: footprint.offsetY },
                  { rotate: footprint.rotation },
                ]
              }
            ]}
          >
            <Text style={styles.footprint}>🐾</Text>
          </Animated.View>
        ))}
      </View>
    );
  };

  const getLessonPosition = (index: number): { offsetX: number } => {
    const patternIndex = index % lessonPositions.length;
    const position = lessonPositions[patternIndex];
    
    return {
      offsetX: position.offsetX * width
    };
  };

  const getStatusText = (status: LessonStatus) => {
    switch (status) {
      case 'completed':
        return t('lessonStatus.mastered');
      case 'current':
        return t('lessonStatus.readyToLearn');
      case 'locked':
        return t('lessonStatus.comingSoon');
      default:
        return t('lessonStatus.comingSoon');
    }
  };

  const renderLessonNode = (lesson: Lesson, index: number) => {
    const position = getLessonPosition(index);
    const isHovered = hoveredLesson === lesson.id;
    
    return (
      <Animated.View 
        key={lesson.id} 
        style={[
          styles.lessonContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { translateX: position.offsetX },
            ]
          }
        ]}
      >
        {/* Lesson Node */}
        <TouchableOpacity
          style={[
            styles.lessonNode,
            ...getStatusStyle(lesson.status, isHovered),
            lesson.status === 'current' && {
              transform: [{ scale: pulseAnim }]
            },
            isHovered && { transform: [{ scale: 1.05 }] }
          ]}
          onPress={() => startPronunciation(lesson)}
          onPressIn={() => setHoveredLesson(lesson.id)}
          onPressOut={() => setHoveredLesson(null)}
          activeOpacity={lesson.status === 'locked' ? 1 : 0.6}
        >
          <Text style={styles.dinoEmoji}>{lesson.dinoEmoji}</Text>
          
          {lesson.status === 'current' && (
            <Animated.View style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={16} color="white" />
            </Animated.View>
          )}
          
          {lesson.status === 'completed' && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check-bold" size={14} color="white" />
            </View>
          )}
          
          {lesson.titleKey.includes('Boss') && (
            <View style={styles.bossGlow} />
          )}
          
          {/* Hover sparkle effect */}
          {isHovered && lesson.status !== 'locked' && (
            <View style={styles.hoverEffect}>
              <Text style={styles.hoverEmoji}>✨</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.lessonInfo}>
          <Text style={[
            styles.lessonTitle,
            isHovered && lesson.status !== 'locked' && styles.titleHovered
          ]}>
            {t(lesson.titleKey)}
          </Text>
          <Text style={styles.lessonSubtitle}>
            {getStatusText(lesson.status)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderWeekHeader = (weekNum: number) => {
    return (
      <Animated.View 
        style={[
          styles.weekHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Surface style={styles.weekBadge} elevation={4}>
          <MaterialCommunityIcons name="calendar-star" size={20} color="white" />
          <Text style={styles.weekText}>{t('week', { number: weekNum })}</Text>
        </Surface>
      </Animated.View>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      bounces={true}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Sticky Stats Bar */}
      <View style={styles.stickyStatsBar}>
        <Text style={styles.journeyText}>{t('home.learningJourney')}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fire" size={22} color="#FF5722" />
            <Text style={styles.statNumber}>{user.streak}</Text>
            <Text style={styles.statLabel}>{t('stats.dayStreak')}</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="lightning-bolt" size={22} color="#FFC107" />
            <Text style={styles.statNumber}>{user.score}</Text>
            <Text style={styles.statLabel}>{t('stats.dinoEnergy')}</Text>
          </View>
        </View>
      </View>

      {/* Main Roadmap */}
      <View style={styles.roadmap}>
        {/* Week 1 Section */}
        {renderWeekHeader(1)}
        <View style={styles.weekSection}>
          {localizedLessons.slice(0, 6).map((lesson, index) => (
            <View key={lesson.id}>
              {renderLessonNode(lesson, index)}
              {/* Add footprint between lessons (except after the last one) */}
              {index < 5 && renderFootprint(index)}
            </View>
          ))}
        </View>
        
        {/* Week 2 Section */}
        {renderWeekHeader(2)}
        <View style={styles.weekSection}>
          {localizedLessons.slice(6, 12).map((lesson, index) => (
            <View key={lesson.id}>
              {renderLessonNode(lesson, index + 6)}
              {/* Add footprint between lessons (except after the last one) */}
              {index < 5 && renderFootprint(index + 6)}
            </View>
          ))}
        </View>
        
        {/* Coming Soon Section */}
        <Animated.View 
          style={[
            styles.comingSoon,
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }]
            }
          ]}
        >
          <Text variant="titleMedium" style={styles.comingSoonTitle}>
            {t('home.moreAdventuresAhead')}
          </Text>
          <Text style={styles.comingSoonText}>
            {t('home.keepPracticing')}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  stickyStatsBar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: '#6200EE',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  journeyText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: width * 0.06,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  statNumber: {
    color: 'white',
    fontSize: width * 0.032,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: width * 0.025,
    fontWeight: '500',
  },
  roadmap: {
    paddingTop: 10,
    alignItems: 'center',
    position: 'relative',
  },
  weekHeader: {
    alignItems: 'center',
    marginVertical: 15,
  },
  weekBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  weekSection: {
    width: '100%',
    paddingHorizontal: width * 0.05,
  },
  lessonContainer: {
    alignItems: 'center',
    marginVertical: 15,
    position: 'relative',
  },
  lessonNode: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.11,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    position: 'relative',
  },
  completed: {
    backgroundColor: '#4CAF50',
    opacity: 1,
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  current: {
    backgroundColor: '#FF9800',
    opacity: 1,
    borderWidth: 4,
    borderColor: '#FF5722',
  },
  locked: {
    backgroundColor: '#BDBDBD',
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#9E9E9E',
  },
  hovered: {
    elevation: 15,
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  dinoEmoji: {
    fontSize: width * 0.09,
  },
  playButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#FF5722',
    borderRadius: 18,
    padding: 8,
    elevation: 6,
  },
  checkmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    padding: 6,
    elevation: 6,
  },
  bossGlow: {
    position: 'absolute',
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: width * 0.13,
    backgroundColor: '#FFD700',
    opacity: 0.3,
    zIndex: -1,
  },
  hoverEffect: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  hoverEmoji: {
    fontSize: 16,
  },
  lessonInfo: {
    alignItems: 'center',
    marginTop: 12,
    maxWidth: width * 0.35,
  },
  lessonTitle: {
    fontSize: width * 0.038,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleHovered: {
    color: '#1B5E20',
    fontSize: width * 0.04,
  },
  lessonSubtitle: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  comingSoon: {
    alignItems: 'center',
    marginTop: 50,
    padding: width * 0.08,
    backgroundColor: '#F3E5F5',
    borderRadius: width * 0.06,
    elevation: 4,
    marginHorizontal: width * 0.04,
  },
  comingSoonTitle: {
    fontSize: width * 0.048,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: width * 0.035,
    color: '#7B1FA2',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpace: {
    height: 40,
  },
  footprintGroupContainer: {
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  footprintContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  footprint: {
    fontSize: 24,
    opacity: 0.6,
  },
});

export default HomeScreen;