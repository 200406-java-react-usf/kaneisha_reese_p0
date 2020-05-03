import { Groomer } from '../models/groomer'

let id = 1; 

export default [
    new Groomer(id++,"swinchester", "password", "Suzie", "Whinchester", 0, 0),
    new Groomer(id++, "bmann", "password","Brandon", "Mann", 0, 0),
    new Groomer(id++, "pbarton", "password","Paul", "Barton", 0, 0),
    new Groomer(id++, "lthompson", "password","Lucy", "Thompson", 0, 0),
    new Groomer(id++, "awinchester", "password","Andrew", "Whinchester", 0, 0)
]