export function validateEcuadorianDNI(dni: string): boolean {
    // Validar que tenga exactamente 10 dígitos numéricos
    if (!/^\d{10}$/.test(dni)) return false;

    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];

    // Validar primeros dos dígitos (provincia)
    const firstTwoDigits = Number(dni.substring(0, 2));
    if (firstTwoDigits < 1 || firstTwoDigits > 24) return false;

    // Validar tercer dígito (tipo de cédula)
    if (Number(dni[2]) > 6) return false;

    // Calcular acumulado de productos
    let sumOfProducts = 0;
    for (let i = 0; i < 9; i++) {
        const product = Number(dni[i]) * coefficients[i];
        sumOfProducts += product > 9 ? product - 9 : product;
    }

    // Calcular dígito verificador
    const verifier = sumOfProducts % 10 === 0 ? 0 : 10 - (sumOfProducts % 10);

    // Validar dígito verificador con el último dígito de la cédula
    return verifier === Number(dni[9]);
};

export function validateEcuadorianPassport(passport:string):boolean {
    // Verificar que el pasaporte tenga exactamente 9 caracteres
    if (!/^[A-Z]{2}\d{7}$/.test(passport)) return false;

    // Verificar que el primer carácter sea 'E'
    if (passport[0] !== 'E') return false;

    // Si pasa todas las validaciones, el pasaporte es válido
    return true;
}
