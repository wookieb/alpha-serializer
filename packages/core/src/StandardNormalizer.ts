import {DataNormalizer} from "./DataNormalizer";
import * as normalizations from './normalizations';

export class StandardNormalizer extends DataNormalizer {
    constructor() {
        super();
        this.registerNormalization(normalizations.MAP);
        this.registerNormalization(normalizations.SET);
        this.registerNormalization(normalizations.DATE);
    }
}