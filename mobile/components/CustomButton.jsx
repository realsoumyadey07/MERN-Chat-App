import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, textStyles, buttonStyles}) => {
  return (
    <TouchableOpacity style={buttonStyles}>
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton