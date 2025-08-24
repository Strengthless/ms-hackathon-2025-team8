import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, Title, Avatar } from 'react-native-paper'
import { Badge } from '../constants/mockData'

type BadgeCardProps = {
    badge: Badge
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
    return (
        <Card style={styles.card}>
            <Card.Content style={styles.content}>
                <Avatar.Icon
                    size={50}
                    icon={badge.icon}
                    style={{ backgroundColor: badge.color }}
                    color="white"
                />
                <View style={styles.textContainer}>
                    <Title style={styles.title}>{badge.name}</Title>
                </View>
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 8,
        width: 150,
    },
    content: {
        alignItems: 'center',
    },
    textContainer: {
        marginTop: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
    },
})

export default BadgeCard
