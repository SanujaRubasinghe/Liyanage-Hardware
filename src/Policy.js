import React from 'react'
import Disclaimer from './Components/Disclaimer'
import ShippingPolicy from './Components/ShippingPolicy'
import ReturnPolicy from './Components/ReturnPolicy'
import TermsAndConditions from './Components/TermsAndConditions'

function Policy() {
  return (
    <div>
        <h1>Policy Page</h1>
        <Disclaimer/>
        <ShippingPolicy/>
        <ReturnPolicy/>
        <TermsAndConditions/>
    </div>
  )
}

export default Policy