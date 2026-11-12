import React from 'react';
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	View,
} from 'react-native';

type CardComponentProps = {
	text: string;
	image: ImageSourcePropType;
};

function CardComponent({ text, image }: CardComponentProps) {
	return (
		<View style={styles.card}>
			<Image source={image} style={styles.image} />
			<Text style={styles.text}>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		overflow: 'hidden',
		borderRadius: 12,
		backgroundColor: '#fff',
		elevation: 3,
	},
	image: {
		width: '100%',
		height: 160,
		resizeMode: 'cover',
	},
	text: {
		padding: 16,
		fontSize: 16,
	},
});

export default CardComponent;
