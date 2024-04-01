const QuestionsList: [string, number, string, boolean][] = []; // question category, question number, question text, was already in use?
let category: string = '';

document.addEventListener('DOMContentLoaded', (): void => {

    const buttonElement: HTMLButtonElement = document.querySelector('button') as HTMLButtonElement;
    const categoryList: HTMLSelectElement = document.getElementById('categoryList') as HTMLSelectElement;

    fetch('Qlist_2.txt')
        .then((response) => {
            return response.text();
        })
        .then((data: string) => {
            //add to array
            let i: number = 0;
            let tempIndex: number = 0;
            let index: number = data.indexOf('\n');
            let indexTab: number = data.indexOf('\t');
            while (index != -1) {
                let tempTuple: [string, number, string, boolean] = [replaceString(data.substring(tempIndex, indexTab)), i++, replaceString(data.substring(indexTab, index)), false];
                tempIndex = index;
                QuestionsList.push(tempTuple);
                index = data.indexOf('\n', index + 1);
                indexTab = data.indexOf('\t', indexTab + 1);
            }
            setCategoryList();
            category = categoryList.options[categoryList.selectedIndex].value;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    categoryList.addEventListener("change", function () {
        category = categoryList.options[categoryList.selectedIndex].value;
    });

    buttonElement.addEventListener('click', (): void => {
        let questionP: HTMLElement = document.getElementById('questionP') as HTMLElement;
        questionP.innerHTML = getQuestion()[2];
    }, false)

});

function getQuestion(): [string, number, string, boolean] {
    function getRandomQuestion(filteredArray: [string, number, string, boolean][]): number {
        return Math.floor(Math.random() * filteredArray.length);
    }


    const filteredArray: [string, number, string, boolean][] = QuestionsList.filter((element: [string, number, string, boolean]): boolean => {
        return element[0] === category;
    });


    let qNumber: number = getRandomQuestion(filteredArray);
    let iterationNumber: number = 0;
    while (filteredArray[qNumber][3]) { // column 4 is marker
        qNumber = getRandomQuestion(filteredArray);
        iterationNumber++;
        if (iterationNumber > filteredArray.length) {
            break;
        }
    }
    filteredArray[qNumber][3] = true;
    return filteredArray[qNumber];
}

function setCategoryList(): void {
    let categorySet: Set<string> = new Set(QuestionsList.map((item: [string, number, string, boolean]) => item[0]));
    const categoryList: HTMLElement = document.getElementById('categoryList') as HTMLElement;

    categorySet.forEach((element: string): void => {
        let newListPart: HTMLOptionElement = document.createElement('option') as HTMLOptionElement;
        newListPart.setAttribute('value', `${element}`);
        newListPart.innerText = element;
        categoryList.appendChild(newListPart);
    });
}

function replaceString(originalString: string): string {
    let newString: string = originalString.replace("\n", '');
    newString = newString.replace("\t", '');
    return newString;
}