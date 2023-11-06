import React from 'react';
import {TouchableHighlight, Image} from 'react-native';
import styles from '../../styles/navBarButtonStyles';

const NavBarButton = ({onPress, image}) => {
  return (
    <TouchableHighlight onPress={onPress} style={styles.button}>
      <Image source={image} />
    </TouchableHighlight>
  );
};

export default NavBarButton;
