import { Service } from '../models/service'

export default [
    new Service('bath', [0.5,0.5,1], [20, 25, 35]),
    new Service('style', [1,1,1.5], [20, 25, 35]),
    new Service('nails', [0.25,0.25,0.25], [10, 10, 10]),
    new Service('teeth', [0.25,0.25,0.25], [10, 10, 10]),
]