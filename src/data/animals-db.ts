import { Animal } from '../models/animals'

let id = 1;

export default [
    new Animal(id++, 'Snickers', 1, 19, true),
    new Animal(id++, 'Reesey', 1, 65, true),
    new Animal(id++, 'Smoke', 1, 35, true),
]