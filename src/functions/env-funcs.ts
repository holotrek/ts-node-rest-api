export function mergeEnvironments(mainEnv: any, updatedEnv: any) {
    for (const e in updatedEnv) {
        if (updatedEnv.hasOwnProperty(e)) {
            mainEnv[e] = updatedEnv[e];
        }
    }

    return mainEnv;
}
