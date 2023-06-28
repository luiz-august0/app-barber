import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'react-native-elements';

const Dropdown = ({ label, data, onSelect, initialValue, dropdownWidth }) => {
	const [selected, setSelected] = useState(undefined);
  	const [visible, setVisible] = useState(false);
	const DropdownButton = useRef();
	const [dropdownTop, setDropdownTop] = useState(0);
	const [dropdownTopButton, setDropdownTopButton] = useState(0);
	const [dropdownLeft, setDropdownLeft] = useState(0);
	const [dropdownRight, setDropdownRight] = useState(0);

	useEffect(() => {
		if (initialValue !== null && initialValue !== undefined && initialValue !== '') {
			setSelected(initialValue);
		}
	},[])

	const toggleDropdown = () => {
		visible ? setVisible(false) : openDropdown();
	};
	
	const openDropdown = () => {
		DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {	
			if (Platform.OS !== 'ios') {
				py = py - 24;
			}
			setDropdownTop(py);
			setDropdownTopButton(py);
			setDropdownLeft(_px);
			setDropdownRight(_fx);

			if ((py + h) > 0) {
				setVisible(true);
			}
		});
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
		  	<Text style={{color: '#BA6213', fontFamily: 'Manrope-Regular'}} >{item.label}</Text>
		</TouchableOpacity>
	);

	const onItemPress = (item) => {
		setSelected(item);
		onSelect(item);
		setVisible(false);
	};

  	const renderDropdown = () => {
		return (
			<Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
				<TouchableWithoutFeedback onPress={() => setVisible(false)}>
            		<View style={styles.modalOverlay} />
          		</TouchableWithoutFeedback>
				<View>
					<TouchableOpacity
						style={[styles.button, { top: dropdownTopButton, left: dropdownLeft, right: dropdownRight, width: dropdownWidth }]}
						onPress={toggleDropdown}
					>			
					</TouchableOpacity>
					<View style={[styles.dropdown, { top: dropdownTop, left: dropdownLeft, right: dropdownRight, width: dropdownWidth }]}>
						<FlatList
							data={data}
							renderItem={renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
          		</View>
			</Modal>
		)
  	};

	return (
		<View ref={DropdownButton} collapsable={false}>
			<TouchableOpacity
				style={[styles.button, { width: dropdownWidth }]}
				onPress={toggleDropdown}
			>
				{renderDropdown()}
				<Text style={[styles.buttonText, { color: (selected && '#BA6213') || '#BA6213' }]}>
					{(selected && selected.label) || label}
				</Text>
				<Icon type='font-awesome' name='angle-down' color={'#BA6213'}/>
			</TouchableOpacity>
		</View>
  	);
}

const styles = StyleSheet.create({
	button: {
    	flexDirection: 'row',
    	alignItems: 'center',
    	backgroundColor: '#FDEBDD',
    	height: 40,
    	width: 150,
    	paddingHorizontal: 10,
		borderRadius: 10
  	},
  	buttonText: {
    	flex: 1,
		fontFamily: 'Manrope-Regular',
    	textAlign: 'center',
		color: '#BA6213'
  	},
	dropdown: {
		backgroundColor: '#FDEBDD',
		width: 150,
		maxHeight: 250,
		shadowColor: '#000000',
		shadowRadius: 4,
		shadowOffset: { height: 4, width: 0 },
		shadowOpacity: 0.5,
		borderRadius: 10
	},
	item: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderRadius: 10
	},
	modalOverlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
});

export default Dropdown;