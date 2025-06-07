import type { RegisterUserParams } from "@/models/auth.model.ts";

type RegisterUserKeys = keyof RegisterUserParams

export function areAllFieldsRequired(fields: RegisterUserParams) {
    const keyOfFields = Object.keys(fields) as RegisterUserKeys[]

   return keyOfFields.every((fieldKey) => {
    const currField = fields[fieldKey]

    if(Array.isArray(currField)) return currField.length

    return currField
   })
}