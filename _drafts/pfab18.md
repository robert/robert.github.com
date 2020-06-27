Making file as small as possible

* JSON file
* Can fiddle the JSON to make it smaller but that's not fun
* Can come up with our own format - get to choose the conventions to minimize boilerplate. Maybe first 6 chars are original, next 6 are ANSI
* Don't even need the first 6, could just use a convention to specify the order. Reduces flexibility but maybe that's OK. Could use the first N chars of the file to specify the filetype
* Don't need newlines, they take up an extra char
* Can use a single char for each RGB element