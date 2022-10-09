// DEFINIR VARIABLES DOM
const selectedDivisa = document.querySelector("#selector-divisa");
const pesosCLP = document.querySelector("#input-clp");
const convertIntoBtn = document.querySelector("#convert-btn");
const convertedDivisa = document.querySelector("#resultado-conversion");

// RESETEAR DATOS DE LA PAGINA
selectedDivisa.value = "Seleccione moneda";
pesosCLP.value = "";

// OBTENER LAS MONEDAS DE MINDICADOR.CL
async function getJsonDivisaSelected() {
    const res = await fetch(`https://mindicador.cl/api/${selectedDivisa.value}`);
    const divisasArray = await res.json();
    return divisasArray;
}

// RENDERER EL VALOR CALCULADO EN EL DOM
async function renderConvertedDivisa() {
    try {
        // CÓDIGO PARA CONVERTIR DIVISAS
        const currency = await getJsonDivisaSelected();
        result = pesosCLP.value / currency.serie[0].valor;
        convertedDivisa.innerHTML = Intl.NumberFormat('de-DE').format(result.toFixed(2));

        // CÓDIGO PARA CREAR LA GRÁFICA

        const labels = currency.serie.slice(0, 10).map((currencyData) => {
            return currencyData.fecha.substring(0, 10)
            /* toLocaleDateString("en-GB") */
        }).sort();
        const data = currency.serie.slice(0, 10).map((currencyData) => {
            return currencyData.valor
        }).sort();
        const datasets = [
            {
                label: "Divisa",
                borderColor: "gold",
                data
            }
        ];
        const config = {
            type: "line",
            data: { labels, datasets }
        };
        const myChart = document.getElementById("myChart");
        myChart.style.backgroundColor = "white";
        if (window.grafica) {
            window.grafica.clear();
            window.grafica.destroy();
        }
        window.grafica = new Chart(myChart, config);
        
    } catch (e) {
        convertedDivisa.innerHTML = "Error al ejecutar el calculo"
        console.log(e.message);
    }
};

convertIntoBtn.addEventListener("click", () => {
    renderConvertedDivisa();
});