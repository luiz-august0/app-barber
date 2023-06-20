import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StarRate = ({starRating}) => {
  	const starRatingOptions = [1, 2, 3, 4, 5];

	const animatedButtonScale = new Animated.Value(1);

	const animatedScaleStyle = {
		transform: [{ scale: animatedButtonScale }],
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
		<View style={styles.container}>
			<View style={styles.stars}>
			{starRatingOptions.map((option) => (
				<View key={option}>
					<Animated.View style={animatedScaleStyle}>
						<MaterialIcons
						name={starRating >= option ? 'star' : 'star-border'}
						size={32}
						style={starRating >= option ? styles.starSelected : styles.starUnselected}
						/>
					</Animated.View>
				</View>
			))}
			</View>
		</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
  	container: {
		flex: 1,
		alignItems: 'flex-end',
  	},
	heading: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
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

export default StarRate;