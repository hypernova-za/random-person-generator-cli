import { faker } from '@faker-js/faker';

enum Sex {
    Male,
    Female
}

enum Citizenship {
    SouthAfrican,
    PermanentResident
}

class SouthAfricanIdNumber {
    private dateOfBirth: Date;
    private sex: Sex = Sex.Male
    private citizenship: Citizenship = Citizenship.SouthAfrican;

    constructor(dateOfBirth: Date, sex: Sex, citizenship: Citizenship) {
        this.dateOfBirth = dateOfBirth;
        this.sex = sex;
        this.citizenship = citizenship;
    }

    private formatDateYYMMDD(date: Date): string {
        const year = date.getFullYear() % 100;
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    }

    private RandomDigits(rangeStart: number, rangeEnd: number, length: number): string {
        const range = rangeEnd - rangeStart + 1;
        const randomNumber = Math.floor(Math.random() * range) + rangeStart;
        return randomNumber.toString().padStart(4, '0');
    }

    private CalculateLuhnChecksum(id: string): number {
        const digits = id.split('').reverse().map(Number);
        const checksum = digits.reduce((sum, digit, index) => {
            if (index % 2 === 0) {
                const doubled = digit * 2;
                return sum + (doubled > 9 ? doubled - 9 : doubled);
            }
            return sum + digit;
        }, 0);
        return (10 - (checksum % 10)) % 10;
    }

    public GenerateIdNumber(): string {
        let datePart = this.formatDateYYMMDD(this.dateOfBirth);
        let sexPart = this.sex == Sex.Female ? this.RandomDigits(0, 4999, 4) : this.RandomDigits(5000, 9999, 4);
        let citizenshipPart = this.citizenship === Citizenship.SouthAfrican ? '0' : '1'; // Assuming '0' for South African and '1' for Permanent Resident
        let idWithoutChecksum = datePart + sexPart + citizenshipPart + '8';
        return idWithoutChecksum + this.CalculateLuhnChecksum(idWithoutChecksum);
    }
}

class RandomPerson {
    public firstName?: string;
    public surname?: string;
    public title?: string;
    public dateOfBirth?: Date;
    public southAfricanIdNumber?: string;
    public sex: Sex = Sex.Male;
    public citizenship: Citizenship = Citizenship.SouthAfrican;
    public age(): number {
        if (!this.dateOfBirth) return 0;

        const today = new Date();
        const birthDateThisYear = new Date(today.getFullYear(), this.dateOfBirth.getMonth(), this.dateOfBirth.getDate());
        const age = today.getFullYear() - this.dateOfBirth.getFullYear();

        return today < birthDateThisYear ? age - 1 : age;
    }
}

class PropertyLogger {
    static logPropery(descripton: string, padToLength: number, value: string): void {
        let paddedDescripton = descripton.padEnd(padToLength, ' ');
        console.log(`${paddedDescripton}: ${value}`);
    }
}

let person = new RandomPerson();
person.firstName = faker.person.firstName();
person.surname = faker.person.lastName();
person.title = faker.person.prefix().replace(/[^a-zA-Z]/g, ''); // Clean up any non-alphabetic characters
person.dateOfBirth = faker.date.birthdate({ min: 6, max: 85, mode: 'age' });
person.sex = faker.helpers.arrayElement([Sex.Male, Sex.Female]);
person.citizenship = faker.helpers.arrayElement([Citizenship.SouthAfrican, Citizenship.PermanentResident]);
person.southAfricanIdNumber = new SouthAfricanIdNumber(person.dateOfBirth, person.sex, person.citizenship).GenerateIdNumber();

const padToLength = 30

console.log();
PropertyLogger.logPropery('First Name', padToLength, person.firstName);
PropertyLogger.logPropery('Surname', padToLength, person.surname);
PropertyLogger.logPropery('Title', padToLength, person.title || 'N/A');
PropertyLogger.logPropery('Date of Birth', padToLength, person.dateOfBirth ? person.dateOfBirth.toISOString().slice(0, 10) : 'N/A');
PropertyLogger.logPropery('Sex', padToLength, person.sex === Sex.Male ? 'Male' : 'Female');
PropertyLogger.logPropery('Citizenship', padToLength, person.citizenship === Citizenship.SouthAfrican ? 'South African' : 'Permanent Resident');
PropertyLogger.logPropery('South African ID Number', padToLength, person.southAfricanIdNumber);
PropertyLogger.logPropery('Age', padToLength, person.age().toString());

console.log();