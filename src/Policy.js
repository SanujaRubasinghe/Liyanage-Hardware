import React from 'react'
import Disclaimer from './Components/Disclaimer'
import ShippingPolicy from './Components/ShippingPolicy'
import ReturnPolicy from './Components/ReturnPolicy'
import TermsAndConditions from './Components/TermsAndConditions'

import { Helmet } from 'react-helmet'

function Policy() {
  return (
    <>
    <Helmet>
      <title>Privacy Policy | New Liyanage Hardware</title>
      <meta name="description" content="Review our privacy practices and data protection policy." />
      <link rel="canonical" href="https://newliyanagehardware.lk/policy" />
    </Helmet>
    <div>
        <h1>Policy Page</h1>
        <Disclaimer/>
        <ShippingPolicy/>
        <ReturnPolicy/>
        <TermsAndConditions/>
    </div>
    </>
  )
}

export default Policy