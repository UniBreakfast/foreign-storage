# foreignStorage (like localStorage but in a cloud)

([monkey browser extension version is published here](https://greasyfork.org/en/scripts/440157-foreignstorage))

Buy enabling this script you're getting the global object `foreignStorage`, which is quite similar to the well known (I hope) standard `localStorage` object.

Differences are:

- `localStorage` stores data per page (domain), `foreignStorage` stores common data no matter which page you are on
- `localStorage` stores data just in one browser for one user account, `foreignStorage` stores in the cloud (Google Sheet actually) for everybody
- `localStorage` is limited by around 5Mb, `foreignStorage` limits are currently unknown, but I have a big hope that it is much more
- `localStorage` is synchronous, `foreignStorage` is asyncronous (because it stores data far away in the cloud)

## You and everybody else can store, overwrite and read every key/value pair from anywhere

Really. Without authorization or anything like that. Total trust. So please don't use it to store sensitive information.

### foreignStorage.setItem(key, valueString)

```js
await foreignStorage.setItem('my_unique_key', '["JSON", "stringified", "data", {"with": "some", "data": "in it"}]')
```

Stores new key/value pair or overwrites value of existing, if one was already stored. Returns true or throws an error.

### foreignStorage.getItem(key)

```js
await foreignStorage.getItem('my_unique_key')
```

Reads key/value pair and returns what was stored. Returns the string value or undefined (if key not found). Or throws an error.

### foreignStorage.removeItem(key)

```js
await foreignStorage.removeItem('my_unique_key')
```

Removes key/value pair if it was there. Returns true or throws an error.

### foreignStorage.getLength()

```js
await foreignStorage.getLength()
```

Returns the total count of key/value pairs in the foreignStorage or throws an error.

### foreignStorage.listKeys()

```js
await foreignStorage.listKeys()
```

Returns the list of all keys in the foreignStorage or throws an error.

---

### foreignStorage.clear()

```js
await foreignStorage.clear()
```

Removes all key/value pairs. Yours, everyone's. Returns true or throws an error.

CAUTION!!! THIS WILL SIGNIFICANTLY LOWER YOUR CARMA IF SOMEBODY'S DATA IS LOST IN THE PROCESS AND HE OR SHE WASN'T ACTUALLY READY TO LOOSE IT!

If you're going to use `foreignStorage`, be nice and play carefully!

([monkey browser extension version is published here](https://greasyfork.org/en/scripts/440157-foreignstorage))
