import {create} from "./create";
import {normalizer} from "alpha-serializer";

module.exports = Object.assign(create(normalizer), {create});