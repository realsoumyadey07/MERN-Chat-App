import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface CustomButtonType {
    title: String,
    textStyle: Object,
    buttonStyle: Object,
    handleSubmit: ()=> void
}
const CustomButton = ({title, textStyle, buttonStyle, handleSubmit}: CustomButtonType) => {
  return (
    <TouchableOpacity style={buttonStyle} onPress={()=> handleSubmit()}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

