/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

/**
 * Bind “this” argument to each user-defined class method
 * @param context this argument
 */
function bindContextToMethods<T> (context: T) {
    const methods = new Set<string>();

    let object = context;
    while (object = Reflect.getPrototypeOf(object as any) as any)
        Reflect.ownKeys(object as any).forEach(k => methods.add(k.toString()));

    let userDefinedMethods = [ ...methods ];
    userDefinedMethods = userDefinedMethods.slice(
        userDefinedMethods.indexOf("constructor") + 1,
        userDefinedMethods.indexOf("toString")
    );

    userDefinedMethods.forEach(method =>
        (context as any)[method] = (context as any)[method].bind(context));
}

export { bindContextToMethods };
