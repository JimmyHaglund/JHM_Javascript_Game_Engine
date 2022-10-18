# TODO JhmEngine

## Type class

Types are neccessary for obtaining entity components using generic methods with type parameters. Since a common use case is something like fetching a component from another entity during collision, this seems like a very useful feature. However, adding types manually is not an acceptable approach - need to examine scripting opportunities. It should be possible to set up the build script to grab any IComponent implementer and build a type declaration from that. That would essentially act as a compiler.

Additionally, consider wether there are other options available. Strong typing goes against JS architecture. Is there another way to check if a JS object implements an interface / a set of commands?

## 2022 V.41

### 2022-10-12 ONS

It should be fairly simple to generate a Type class during compilation. For each file, do a string check for type implementations. Create a template Type class file in the source which contains the required methods as well as an empty datastructure for the types. Have the transpilation code fill the datastructure during compilation.

I'll need to set up the project transpiler to do the same thing, which will be a bit different since we'll have to add to the existing set of types. Shouldn't be impossible or anything.

For chained inheritance, the Type class can simply run a recursive function on each implemented type until it finds one that is handled, or until it's empty. This sounds kind of performance-intensive, but there shouln't really ever be more than at most three concrete implementations in an inheritance chain, and multiple inheritances only comes from interfaces which shouldn't inherit too often themselves.
