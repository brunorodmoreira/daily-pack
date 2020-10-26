import React, { FC, useMemo } from 'react'
import { Button, withToast } from 'vtex.styleguide'
import styles from './styles.css'

const RetailerLocations: FC<{ showToast: Function }> = ({ showToast }) => {


    return (
        <div

        >
            <Button block onClick={handleClick}>
                <span className={styles.addItemButtonText}>Retailer Locations</span>
            </Button>
        </div>
    )
}

export default withToast(RetailerLocations)


//https://thomas.vtexcommercestable.com.br/api/dataentities/retailerlocations/schemas/v1

// {
//     "properties": {
//         "name": {
//             "type": "string"
//         },
//         "address": {
//             "type": "string"
//         },
//         "number": {
//             "type": "string"
//         },
//         "complement": {
//             "type": "string"
//         },
//         "neighborhood": {
//             "type": "string"
//         },
//         "city": {
//             "type": "string"
//         },
//         "state": {
//             "type": "string"
//         },
//         "postalCodeStart": {
//             "type": "string"
//         },
//         "postalCodeEnd": {
//             "type": "string"
//         }
//     },
//     "v-indexed": [
//         "name",
//         "postalCodeStart",
//         "postalCodeEnd"
//     ],
//     "v-default-fields": [
//         "id",
//         "name",
//         "address",
//         "number",
//         "neighborhood",
//         "city",
//         "state",
//         "postalCodeStart",
//         "postalCodeEnd"
//     ],
//     "v-cache": false,
//     "required": [
//         "name",
//         "address",
//         "number",
//         "neighborhood",
//         "city",
//         "state",
//         "postalCodeStart",
//         "postalCodeEnd"
//     ]
// }