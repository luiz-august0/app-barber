import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FlexibleStarRate = ({starRating, size}) => {
  	const starRatingOptions = [1, 2, 3, 4, 5];

	const animatedButtonScale = new Animated.Value(1);

	const animatedScaleStyle = {
		transform: [{ scale: animatedButtonScale }],
	};

	return (
		<View>
			<View style={styles.stars}>
			{starRatingOptions.map((option) => (
				<View key={option}>
					<Animated.View style={animatedScaleStyle}>
						<MaterialIcons
						name={starRating >= option ? 'star' : 'star-border'}
						size={size}
						style={starRating >= option ? styles.starSelected : styles.starUnselected}
						/>
					</Animated.View>
				</View>
			))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	heading: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	stars: {
		display: 'flex',
		flexDirection: 'row',
	},
	starUnselected: {
		color: '#aaa',
	},
	starSelected: {
		color: '#ffb300',
	},
});

export default FlexibleStarRate;