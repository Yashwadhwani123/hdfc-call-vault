# ACC React Base Project!

### Get Started
- Clone this repository to your local machine.
- Open the cloned repository in your terminal and run the following commands

```
npm install
npm start
```

### Submit a PR if you want to make any changes to the base project.

## Standard Reusable Components

 1. Entry Box
	 ```
	 <Entry 
		  id={"username"}
		  placeholder={"Here goes your placeholder"} 
		  onChange={onChangeFunction} 
	 />
	```
	
|props|type|Default Value|isRequired| constants
|--|--|--|--|--|
| id | string | | true | |
| type | string | text | false | text, password, number, numeric, email |
| disabled | boolean | false | false | true, false |
| isRequired | boolean | false | false | true, false |
| labelText | string | null | false | |
| placeholder | string | null | false | |
| styleClass | string | standardEntry | false | |
| value | string/number | null | false | |
| onChange | function | null | false | |