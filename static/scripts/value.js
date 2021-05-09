console.log('ready');

inputs = document.getElementsByTagName("input");

for (let i = 0; i < inputs.length; i++) {
    console.log(inputs[i].name);
    console.log(inputs[i].value);
}

select = document.getElementsByTagName("select");

for (let i = 0; i < select.length; i++) {
    console.log(inputs[i].name);
    console.log(select[i].value);
}