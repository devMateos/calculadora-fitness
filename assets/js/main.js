const calculateButton = document.querySelector("#calculate-btn");
const showFitnessInfo = document.querySelector("#fitness-info");
const womanData = document.querySelectorAll(".woman");
const manData = document.querySelectorAll(".man");

function collectData() {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const age = document.querySelector('#age').value;
    const weight = document.querySelector('#weight').value;
    const height = (document.querySelector('#height').value);
    const neck = (document.querySelector('#neck').value);
    const waist = (document.querySelector('#waist').value);
    const hip = (document.querySelector('#hip').value);
    return { gender, age, weight, height, neck, waist, hip, };
}

const radioButtons = document.querySelectorAll('input[type="radio"][name="gender"]');

radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', (event) => {
        const selectedGender = event.target.value;

        if (selectedGender === 'hombre') {
            manData.forEach((element) => {
                element.classList.remove("d-none");
            })
            womanData.forEach((element) => {
                element.classList.add("d-none");
            })
        } else if (selectedGender === 'mujer') {
            manData.forEach((element) => {
                element.classList.add("d-none");
            })
            womanData.forEach((element) => {
                element.classList.remove("d-none");
            })
        }
    });
});

function calculate() {
    const { gender, age, weight, height, neck, waist, hip } = collectData();

    function calculateFatPercentage() {
        let result = 0;

        if (gender === "hombre") {
            result = 86.010 * Math.log10((waist / 2.54) - (neck / 2.54)) - 70.041 * Math.log10(height / 2.54) + 36.76;
        } else if (gender === "mujer") {
            result = 163.205 * Math.log10((waist / 2.54) + (hip / 2.54) - (neck / 2.54)) - 97.684 * Math.log10(height / 2.54) - 78.387;
        }
        return (Math.round(result * 100) / 100).toFixed(2);
    }

    function calculateBMI() {
        const bmi = weight / (height / 100) ** 2;
        return (Math.round(bmi * 100) / 100).toFixed(2);
    }

    function calculateFatMass() {
        const fatMass = weight * (calculateFatPercentage() / 100);
        return (Math.round(fatMass * 100) / 100).toFixed(2);
    }

    return {
        calculateFatPercentage,
        calculateBMI,
        calculateFatMass,
    };
}

let redBG;

const fatMassTable = document.querySelector("#fat-mass-table");
const tableRow = fatMassTable.children;
const tableCells = Array.from(tableRow).flatMap(child => child.querySelectorAll("*"));


calculateButton.addEventListener("click", () => {
    const calculations = calculate();
    const fatPercentage = calculations.calculateFatPercentage();
    const bmi = calculations.calculateBMI();
    const fatMass = calculations.calculateFatMass();

    showFitnessInfo.innerText =
        `Tu Índice de Masa Corporal (IMC) es: ${bmi}
    El porcentaje estimado de grasa corporal es: ${fatPercentage}%
    Tu cantidad de grasa total es: ${fatMass}kg`;


    tableCells[0].forEach(element => {
        element.classList.remove("red-bg");
    })
    function showTable() {
        let category;
        if (collectData().gender === "mujer") {
            if (fatPercentage < 21) {
                category = "bajo";
            } else if (21 <= fatPercentage && fatPercentage < 33) {
                category = "saludable";
            } else if (33 <= fatPercentage && fatPercentage < 39) {
                category = "sobrepeso";
            } else if (39 <= fatPercentage) {
                category = "obesidad";
            }
        } else if (collectData().gender === "hombre") {
            if (fatPercentage < 8) {
                category = "bajo";
            } else if (8 <= fatPercentage && fatPercentage < 20) {
                category = "saludable";
            } else if (20 <= fatPercentage && fatPercentage < 25) {
                category = "sobrepeso";
            } else if (25 <= fatPercentage) {
                category = "obesidad";
            }
        }
        const target = `${collectData().gender}-${category}`;
        redBG = document.querySelector(`#${target}`);
        redBG.classList.add("red-bg");
    };
    showTable();
});





const caloricExpenditureResult = document.querySelector("#caloric-expenditure-result");
const caloricExpenditureButton = document.querySelector("#caloric-expenditure-btn");

caloricExpenditureButton.addEventListener("click", () => {
    const lifeStyle = document.querySelector('input[name="life-style"]:checked').value;
    let caloricExpenditure;
    let totalCaloricExpenditure;
    if (collectData().gender === "hombre") {
        caloricExpenditure = 66 + (13.7 * collectData().weight) + (5 * collectData().height) - (6.8 * collectData().age);
    } else if (collectData().gender === "mujer") {
        caloricExpenditure = 655 + (9.6 * collectData().weight) + (1.8 * collectData().height) - (4.7 * collectData().age);
    }

    if (lifeStyle === "sedentary") {
        totalCaloricExpenditure = caloricExpenditure * 1.2;
    } else if (lifeStyle === "low-exercise") {
        totalCaloricExpenditure = caloricExpenditure * 1.375;
    } else if (lifeStyle === "medium-exercise") {
        totalCaloricExpenditure = caloricExpenditure * 1.55;
    } else if (lifeStyle === "high-exercise") {
        totalCaloricExpenditure = caloricExpenditure * 1.725;
    } else if (lifeStyle === "elite-athlete") {
        totalCaloricExpenditure = caloricExpenditure * 1.9;
    }
    totalCaloricExpenditure = totalCaloricExpenditure.toFixed();
    caloricExpenditureResult.innerText = `Tu gasto calórico diario es de ${totalCaloricExpenditure} kcal`;
});