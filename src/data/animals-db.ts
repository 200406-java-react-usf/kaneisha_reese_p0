import { Animal } from '../models/animals'

let id = 1;

export default [
    new Animal(id++, 'Snickers', 1, 19, ['bath', 'style', 'nails', 'teeth']),
    new Animal(id++, 'Reesey', 1, 65, ['bath', 'nails', 'teeth']),
    new Animal(id++, 'Smoke', 1, 35, ['bath']),
]