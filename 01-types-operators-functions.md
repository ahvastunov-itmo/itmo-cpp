---
title: "Лекция 1. Типы, операторы и функции"
---

::: {.content-visible unless-format="revealjs"}

[Открыть слайды](slides/01-types-operators-functions.html){.btn .btn-outline-primary target="_blank"}

> Источник: [Google Slides](https://docs.google.com/presentation/d/13bW8SWoGPWDIA0dT_gbFFKHjeHFEfSQusTbYF7MpfCg/edit)

:::

## Язык С++


- Типы данных, идентификаторы, операторы, операторы ветвления, циклы, функции

## Hello world


```cpp
#include <iostream>

int main(int argc, char** argv) {
    std::cout << "Hello, world!\n";

    return 0;
}
```

## Идентификаторы


- Конструкции и элементы программы нужно как-то называть
- Идентификаторы – это имена, используемые для обозначения переменных, типов, функций, шаблонов и т.д.
- Идентификаторы могут являться частью выражений              				( например    c = a + b)

## Идентификаторы


- Буквы, цифры и “_”
- Первый символ - буква или “_”
- Прописные и строчные различаются
- Не могут совпадать с ключевыми словами

## Code Style


- Венгерская нотация
- camelCase
- snake_case
- PascalCase
- <https://google.github.io/styleguide/cppguide.html>

## Встроенные типы данных


- char
- Целочисленные
- int
- short (int)
- long (int)
- С плавающей точкой
- float
- double
- bool
- void
- nullptr_t

## Модификаторы


- short
- long
- signed
- unsigned

## Размеры и диапазоны для большинства 32-битных систем


- Name | Size | Range
- char | 1byte | signed: -128 to 127unsigned: 0 to 255
- short | 2bytes | signed: -32768 to 32767unsigned: 0 to 65535
- int | 4bytes | signed: -2147483648 to 2147483647unsigned: 0 to 4294967295
- long | 4bytes | signed: -2147483648 to 2147483647unsigned: 0 to 4294967295
- float | 4bytes | +/- 3.4e +/- 38 (~7 digits)
- double | 8bytes | +/- 1.7e +/- 308 (~15 digits)
- long double | 8bytes | +/- 1.7e +/- 308 (~15 digits)

## numeric_limits


```cpp
#include <iostream>
#include <limits>

int main(int argc, char** argv) {
    std::cout << "Max value: " << std::numeric_limits<long>().max() << std::endl;
    std::cout << "Min value: " << std::numeric_limits<double>().min() << std::endl;
    std::cout << "Is signed value: " << std::numeric_limits<char>().is_signed << std::endl;

    return 0;
}
```

## Целочисленные типы


```cpp
#include <cstdint>
```

- int8_t, int16_t,int32_t, int64_t
- uint8_t, uint16_t, uint32_t, uint64_t
- 1 == sizeof(char) <= sizeof(short) <= sizeof(int) <= sizeof(long) <= sizeof(long long)

## Целочисленные литералы


```cpp
#include <iostream>

int main(int argc, char** argv) {
    int a = 162;
    int b = 0242;         // OCT
    int c = 0xA2;         // HEX
    int d = 0b010100010;  // BIN

    std::cout << "a = " << a << std::endl
              << "b = " << b << std::endl
              << "c = " << c << std::endl
              << "d = " << d << std::endl;
    return 0;
}
```

## Вещественные литералы


```cpp
#include <iostream>

int main(int argc, char** argv) {
    double a = 0.15;
    float b = 0.15f;
    long double c = 15e-2l;
    float d = 15e-2f;

    std::cout << "a = " << a << std::endl
              << "b = " << b << std::endl
              << "c = " << c << std::endl
              << "d = " << d << std::endl;
    return 0;
}
```

## Представление чисел в памяти


- Целые числа
- Прямой код
- Обратный код
- Дополнительный код
- Вещественные
- Знак, порядок, мантисса

## Символьные литералы


- Символьный литерал - ‘x’
- Некоторые символьные литералы начинаются с эскейп-последовательности ‘\n’
- символ новой строки  ‘\n’
- горизонтальная табуляция ‘\t’
- обратная слеш ‘\\’
- одиночная кавычка ‘\‘’
- Строковый литерал “Hello \’ world\’\n”

## Слайд 15

<!-- embedded-images:start -->
![Изображение 1 со слайда 15](assets/01-types-operators-functions/slide-15-image-01.png)
<!-- embedded-images:end -->


## Строковые литералы


- Строка - массив символов
- В конце спец символ конца строки ‘\0’

## bool


- true
- false

## Enum (перечислимый тип)


```cpp
enum Color {
```

- RED,
- GREEN,
- BLUE
```cpp
}
;

Color color = Color::BLUE;
```

## Объявление переменных (declaration)


```cpp
int a;
float b;
char c;

int k, l, n;

unsigned short s;
signed int i;
```

## Определение переменных (definition)


```cpp
int a = 0;
double r = 1.23;
float b = 23.5f;
float c = 1.0e-3;
char ch = 'c';
long l = 23456789L;
int i = 0X1F;
long double ld = 1.2345l;
```

## Операторы


- Арифметические (+, -, *, /, %)
- Сравнение (>, >=, <, <=, ==, !=)
- Логические (&&, ||)
- Инкремента и Декремента (++, --)
- Побитовые (&, |, ^,  <<, >>,  ~)
- Присваивание (=, +=, *=, )
- Условный (?:)
- Специальные (sizeof, static_cast, …)

## Преобразования типов


- Неявные преобразования
- Если какой-либо из операндов принадлежит типу long double, то и другой приводится к long double.
- В противном случае, если какой-либо из операндов принадлежит типу double, то и другой приводится к double.
- В противном случае, если какой-либо из операндов принадлежит типу float, то и другой приводится к float.
- В противном случае операнды типов char и short приводятся к int.
- И наконец, если один из операндов типа long, то и другой приводится к long.
- Явное преобразование (c-style cast) (тип) переменная

## sizeof


```cpp
int x;
printf("sizeof(int) = %zu\n", sizeof(int));
printf("sizeof(float) = %zu\n", sizeof(float));
printf("sizeof(char) = %zu\n", sizeof(char));
printf("sizeof(long long) = %zu\n", sizeof(long long));

printf("sizeof(x) = %zu\n", sizeof(x));
```

## a[k] | индексы | 16 | слева направо

- f(…) | вызов функции | 16 | слева направо
- . | прямой выбор | 16 | слева направо
```cpp
->| опосредованный выбор | 16 | слева направо
```

- ++ -- | положительное и отрицательное приращение | 16 | слева направо
- ++ -- | положительное и отрицательное приращение | 15 | справа налево
- sizeof | размер | 15 | справа налево
- ~ | побитовое НЕ | 15 | справа налево
- ! | логическое НЕ | 15 | справа налево
- + | изменение знака, плюс | 15 | справа налево
- & | адрес | 15 | справа налево

## * | опосредование (разыменование) | 15 | справа налево


- ( имя типа ) | приведение типа | 14 | справа налево
- * / % | мультипликативные операции | 13 | слева направо
- + - | аддитивные операции | 12 | слева направо
- << >> | сдвиг влево и вправо | 11 | слева направо
- < > <= >= | отношения | 10 | слева направо
- == != | равенство/неравенство | 9 | слева направо
- & | побитовое И | 8 | слева направо
- ^ | побитовое исключающее ИЛИ | 7 | слева направо
- | | побитовое ИЛИ | 6 | слева направо
- && | логическое И | 5 | слева направо
- || | логическое ИЛИ | 4 | слева направо
- ? : | условие | 3 | справа налево
- = += -= *= /= %= <<= >>= &= ^= |= | присваивание | 2 | справа налево
- , | последовательная оценка | 1 | слева направо

## a + b * c << d || 25 != 32 && !c++


## Оператор


- Оператор заканчивается «;»
```cpp
c = a + b;
printf(“Hello World”);
i++;
{
    оператор1;
    оператор2;
    оператор3;
}
 - составной оператор
```

## if-else


```cpp
if (выражение) оператор1(или составной оператор);
```

- else
```cpp
оператор2(или составной оператор);
```

- else-часть может отсутствовать
```cpp
if (выражение != 0) тоже самое что if (выражение)
```

## if-else


```cpp
// n == -2, a = 1, b = 2, z = 20;
if (n > 0)
    if (a > b) z = a;
```

- else
```cpp
z = b;

// n == -2, a = 1, b = 2, z = 20;
if (n > 0)
    if (a > b) z = a;
```

- else
```cpp
z = b;
```

## if-else


```cpp
// n == -2, a = 1, b = 2, z = 20;
if (n > 0) {
    if (a > b) {
        z = a;
    }
}
```

- else {
```cpp
z = b;
}

// n == -2, a = 1, b = 2, z = 20;
if (n > 0) {
    if (a > b) {
        z = a;
    }
```

- else {
```cpp
z = b;
}
}
```

## else-if


```cpp
if (выражение1) оператор1;
```

- else if(выражение2)
```cpp
оператор2;
```

- else if(выражение3)
```cpp
оператор3;
```

- else if(выражение4)
```cpp
оператор4;
```

- else
```cpp
оператор5;
```

## Цикл while


```cpp
while (выражение) 
```

- оператор
```cpp
int a;
std::cin >> a;

while (a > 0) {
    std::cout << a << std::endl;
    --a;
}
```

## Цикл do-while


- do
```cpp
оператор;
while (выражение);

unsigned long n;
```

- do
```cpp
{
    std::cout << "Enter number (0 to end): ";
    std::cin >> n;
    std::cout << "You entered: " << n << std::endl;
}
while (n != 0);
```

## Цикл for


```cpp
выр1;
while (выр2) {
```

- оператор
```cpp
выр3;
}

for (выр1; выр2; выр3) 
```

- оператор

## Цикл for


```cpp
for (инициализация; условие; инкремент) оператор;

for (int n = 10; n > 0; n--) {
    std::cout << n << ", ";
}

int i;
for (int n = 0, i = 100; n != i; n++, i--) {
    std::cout << n << ", ";
}
```

## Цикл range for


```cpp
for (объявление : диапазон) оператор;

for (int n : {0, 1, 2, 3, 4, 5}) {
    std::cout << n << ' ';
}
std::cout << '\n';
```

## Операторы break, continue


```cpp
for (int n = 10; n > 0; n--) {
    std::cout << n << ", ";
    if (n == 3) {
        std::cout << "countdown aborted!";
        break;
    }
}
```

## Операторы break, continue


```cpp
for (int n = 10; n > 0; n--) {
    if (n == 5) continue;
    std::cout << n << ", ";
}
```

## Оператор switch


```cpp
switch (выражение) {
    case константа1:
        группа оператор1;
        break;
    case constant2:
        группа оператор2;
        break;
```

- . . .
- default:
```cpp
группа оператор по умолчанию;
}
```

## Оператор switch


- Константы – целые
- Вычисления начинаются с первой совпавшей с константой в  ветке и выражения
- Все константы должны быть разные
- Если совпадения не нашлось то выполняется default
- Break вызывает выход из switch
- Сквозное выполнение

## Оператор switch


```cpp
switch (x) {
    case 1:
        printf("x is 1");
        break;
    case 2:
        printf("x is 2");
        break;
```

- default:
```cpp
printf("unknown");
}

if (x == 1) {
    printf("x is 1");
} else if (x == 2) {
    printf("x is 2");
}
```

- else {
```cpp
printf("unknown");
}
```

## Оператор switch


```cpp
switch (x) {
    case 1:
    case 2:
    case 3:
        printf("x is 1, 2 or 3");
        break;
```

- default:
```cpp
printf("x is not 1, 2, 3");
}
```

## Функции


- тип имя(параметр1, параметр2) {
- объявления и инструкции
```cpp
}
```

## Функции


```cpp
int addition(int a, int b) {
    int result;
    result = a + b;
    return result;
}

int main() {
    int z;
    z = addition(5, 3);
    return 0;
}
```

## Функции. declarations & definitions


- int max(int a, int b); // declaration
```cpp
int main() {
    int c = max(10, 2);  // ok
```

- max(1);              // compile-time error
```cpp
return 0;
}

int max(int a, int b) {  // definition
    return a > b ? a : b;
}
```

## Функция без возвращаемого значения


```cpp
#include <iostream>

void printmessage() {
    std::cout << "I'm a function!\n";
}

int main() {
    printmessage();
    return 0;
}
```

- Нет возвращаемого значения
- Объявление и определение в одном месте

## main


```cpp
int main(void) {
    …
}

int main(int argc, char* argv[]) {
    ...
}
```

- int main (int argc, char *argv[] , other_parameters )
```cpp
{
    ...
}
```

- EXIT_SUCESS, EXIT_FAILURE

## main


```cpp
#include <iostream>

int main(int argc, char* argv[]) {
    for (int i = 0; i < argc; ++i) std::cout << argv[i] << " ";

    return 0;
}
```

- argc - размер массива
- argv - массив строк

## Рекурсия


```cpp
#include <iostream>

unsigned long long factorial(unsigned int n) {
    if (n == 0)
        return 1;
    else
        return n * factorial(n - 1);
}

int main() {
    std::cout << factorial(5) << std::endl;

    return 0;
}
```

## Рекурсия


```cpp
#include <iostream>

unsigned long long factorial(unsigned int n) {
    unsigned long long result = 1;
    for (int i = 2; i <= n; ++i) {
        result *= i;
    }
    return result;
}

int main() {
    std::cout << factorial(5) << std::endl;

    return 0;
}
```

## «Затемнение» внешних переменных


```cpp
#include <iostream>

int x;
int y;
void func(double x) {
    double y;
    std::cout << "x = " << x << " y = " << y << std::endl;
}
int main() {
    x = 21;
    {
        int x = 10;
        y = 239;
        std::cout << "x = " << x << " y = " << y << std::endl;
        func(y);
    }
    std::cout << "x = " << x << " y = " << y << std::endl;
    return 0;
}
```
