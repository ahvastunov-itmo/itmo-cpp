---
title: "Лекция 15. Обработка ошибок"
---

::: {.content-visible unless-format="revealjs"}

[Открыть слайды](slides/15-error-handling.html){.btn .btn-outline-primary target="_blank"}

:::

## Язык С++


- Error Handling

## Ошибки


- Выход за границу массива
- Деление на ноль
- Невозможность выделить память
- Отсутствие прав на открытие файла
- Недоступность внешнего сервера
- ….

## Assert


```{.cpp filename="assert-failure.cpp"}
{{< include examples/15-error-handling/assert-failure.cpp >}}
```

[![](assets/compiler-explorer.svg){.godbolt-link-image width="32"}][godbolt-15-assert-failure]{aria-label="Open in Compiler Explorer"}

Второй `assert` намеренно завершает программу с ошибкой.



- int main(): Assertion `2+2 == 5' failed.

## static_assert


```cpp
static_assert(sizeof(int) == 4, "int must be 4 bytes");

template <typename T>
struct data_structure {
    static_assert(std::is_default_constructible<T>::value,
                  "Data Structure requires default-constructible elements");
};

struct no_default {
    no_default() = delete;
};

int main() {
    data_structure<no_default> ds_error;
    return 0;
}
```

## Код возврата


- // количество успешно записанных
```cpp
size_t fwrite(const void* buffer, size_t size, size_t count, FILE* stream);
// errno
FILE* fopen(const char* filename, const char* mode);
// ошибка в качестве кода возврата
errno_t fopen_s(FILE* restrict* restrict streamptr, const char* restrict filename,
                const char* restrict mode);
```

- ERRNO

## Обработка в месте возврата


```cpp
int main() {
    FILE* file = fopen("test.tmp", "w");
    if (!file) {
        // do something
    }
    if (fprintf(file, "Hello") < 0 || printf(file, "World") < 0) {
        // do something
    }
    if (fclose(file) == EOF) {
        // do something
    }
    return 0;
}
```

## Exception. throw + try + catch


```cpp
int foo() {
    throw std::runtime_error("error");
}

void boo() {
    throw 2;
}

void coo() {
    throw std::string("Hello world");
}

int main(int, char**) {
    try {
        foo();
    } catch (...) {
    }
}
```

## Stack unwinding


- Сконструированный объект передаётся обратно по стеку
- До встречи подходящего блока `try`/`catch`
- При раскрутке стека уничтожаются объекты с automatic storage duration
- Если во время раскрутки стека из деструктора выходит ещё одно исключение, вызывается `std::terminate`
- Деструктор noexcept
- Сам объект хранится в неопределенном участке памяти

## Stack unwinding


```cpp
struct Foo {
    Foo() {
        std::cout << "Foo()\n";
    }
    ~Foo() {
        std::cout << "~Foo()\n";
    }
};

void internalFunc() {
    Foo f;
    throw std::runtime_error("Some error");
}

void externalFunc() {
    try {
        internalFunc();
    } catch (std::exception& e) {
        std::cout << e.what() << std::endl;
    }
}
```

## Exception


```cpp
int main() {
    try {
        foo();
    } catch (const std::overflow_error& e) {
        // do something
    } catch (const std::runtime_error& e) {
        // do something
    } catch (const std::exception& e) {
        // do something
    } catch (...) {
        // do something
    }
```

## Гарантии безопасности исключений


- No guarantee
- Basic guarantee
- Сохраняется инвариант
- Нет утечек
- Strong guarantee
- Сохраняется инвариант
- Нет утечек
- Состояние возвращается к состоянию до исключения
- Nothrow guarantee
- Не может быть выкинуто исключение

## Exception guarantee


```cpp
struct Foo {
    int value;
    Foo(int v) : value(v) {
    }
    Foo(const Foo& other) : value(other.value) {
        if (something) throw std::runtime_error("KEKW");
    }
};
```

- Конструктор может кинуть исключение

## Exception guarantee


```cpp
class Boo {
   private:
    Foo* foo_ = nullptr;
    int value_ = 0;

   public:
    Boo(int value = 0) : value_(value) {
    }
    Boo(int value, int foo_value) : foo_(new Foo{foo_value}), value_(value) {
    }

    ~Boo() {
        delete foo_;
    }

    friend std::ostream& operator<<(std::ostream& stream, const Boo& value);
};
```

## No guarantee


- Boo(const Boo& other)
- : value_(other.value_)
- , foo_(new Foo(*other.foo_))
```cpp
{
}

Boo& operator=(const Boo& other) {
    value_ = other.value_;
    delete foo_;
    foo_ = new Foo(*other.foo_);
    return *this;
}
```

- Возможно other.foo_ == nullptr

## No guarantee


```cpp
Boo& operator=(const Boo& other) {
    if (this == &other) return *this;

    value_ = other.value_;
    delete foo_;
    if (other.foo_) foo_ = new Foo(*other.foo_);
    return *this;
}
```

- После перехвата исключение в foo_ адрес который мы удалили

## Basic guarantee


```cpp
Boo& operator=(const Boo& other) {
    if (this == &other) return *this;

    value_ = other.value_;
    delete foo_;
    foo_ = nullptr;

    if (other.foo_) foo_ = new Foo(*other.foo_);

    return *this;
}
```

- Даже если конструктор бросит исключение Boo останется в инвариантном состоянии

## Basic guarantee


- Boo(const Boo& other)
- : value_(other.value_)
```cpp
{
    if (other.foo_) foo_ = std::make_unique<Foo>(*other.foo_);
}

Boo& operator=(const Boo& other) {
    if (this == &other) return *this;

    value_ = other.value_;
    foo_.release() if (other.foo_) foo_ = std::make_unique<Foo>(*other.foo_);

    return *this;
}
```

- RAII

## Strong guarantee


```cpp
Boo& operator=(const Boo& other) {
    if (this == &other) return *this;

    Boo tmp(other);
    swap(tmp);

    return *this;
}
void swap(Boo& other) noexcept {
    std::swap(value_, other.value_);
    std::swap(foo_, other.foo_);
}
```

- swap не кидает исключение
- Исключение в конструкторе Boo не поменяет состояние this
- Copy And Swap Idiom

## Strong guarantee


```cpp
Boo& operator=(const Boo& other) {
    if (this == &other) return *this;

    Boo tmp(other);
    *this = std::move(tmp);

    return *this;
}

Boo& operator=(Boo&&) noexcept = default;
```

## noexcept


- Сообщает, что исключение не должно покинуть функцию
- Если исключение покидает `noexcept`-функцию, вызывается `std::terminate`
- `throw` внутри функции возможен, если исключение будет перехвачено до выхода
- Позволяет компилятору лучше оптимизировать код
- Деструктор `noexcept` по умолчанию

## std::exception


- Кидать стандартные типы в качестве исключений - малоинформативно
- Исключение должно нести информацию о случившемся событии
- `std::exception` — базовый класс для исключений стандартной библиотеки
- Тип исключения также является полезной информацией

## std::exception


```cpp
class exception {
   public:
    exception() noexcept;
    exception(const exception&) noexcept;
    exception& operator=(const exception&) noexcept;
    virtual ~exception();
    virtual const char* what() const noexcept;
};
```

## std::exception

<!-- embedded-images:start -->
![Изображение 1 со слайда 23](assets/15-error-handling/slide-23-image-01.jpg)
<!-- embedded-images:end -->


## std::exception


```cpp
class my_exception : public std::exception {  // derived from std::exception
   public:
    my_exception(const std::string& what) : what_(what) {
    }
    const char* what() const noexcept override {
        return what_.c_str();
    }

   private:
    std::string what_;
};
```

## std::exception


```cpp
int foo() {
    throw my_exception("error");  // by rvalue
}

int main(int, char**) {
    try {
        foo();
    } catch (const my_exception& e) {  // by const reference
        std::cerr << e.what();
        std::runtime_error
    }
}
```

## Exception


- Исключения предназначены исключительно для обработки ошибок
- Обработка ошибок должна строиться вокруг инварианта объекта
- Исключения принято бросать по значению, а ловить по ссылке

## Exception cost

<!-- embedded-images:start -->
![Изображение 1 со слайда 27](assets/15-error-handling/slide-27-image-01.png)
<!-- embedded-images:end -->


```cpp
struct invalid_value {};

void do_sqrt(std::span<double> values) {
    for (auto& v : values) {
        if (v < 0) throw invalid_value{};
        v = std::sqrt(v);
    }
}
```

- Proposal P2544R0

## `std::expected` (C++23)


```cpp
enum class EDivError {
    DivisionByZero = 0,
};

std::expected<int, EDivError> my_div(int a, int b) {
    if (b == 0) return std::unexpected{EDivError::DivisionByZero};

    return a / b;
}
```

## `std::expected` (C++23)


```cpp
int main() {
    auto r = my_div(8, 0);
    if (r) std::cout << *r << std::endl;

    try {
        std::cout << r.value() << std::endl;
    } catch (const std::bad_expected_access<EDivError>& err) {
        std::cout << err.what() << std::endl;
    }

    return 0;
}
```

## `std::expected` (C++23)


- Позволяет возвращать либо ожидаемое значение либо ошибку
- Накладные расходы сравнимы с кодом возврата
- Передаёт ответственность за обработку вызывающему коду
- `std::expected<T, E>` хранит результат или ошибку
- `std::unexpected<E>` передаёт ошибку
- `std::bad_expected_access<E>` возникает при некорректном вызове `value()`

## Исключения и код возврата


- Исключения позволяют обрабатывать ошибки единообразно, но не в месте возникновения
- Коды возврата позволяют обработать ошибку сразу при возникновении, но не единообразно
- `std::expected` сочетает явную проверку результата с типизированной ошибкой

## Исключения и код возврата


```cpp
uint32_t to_uint(std::string_view str) {
    uint32_t result = 0;
    for (char c : str) {
        result *= 10;
        result += c - '0';
    }

    return result;
}

int main(int, char**) {
    std::cout << to_uint("100500") << std::endl;
}
```

## Исключения и код возврата


```cpp
uint32_t to_uint(std::string_view str) {
    uint32_t result = 0;
    for (char c : str) {
        result *= 10;
        result += c - '0';
    }

    return result;
}

int main(int, char**) {
    std::cout << to_uint("abc") << std::endl;
    std::cout << to_uint("abc100500") << std::endl;
    std::cout << to_uint("100500abc") << std::endl;
}
```

- Требуется обрабатывать исключительные ситуации

## Исключения и код возврата


```cpp
uint32_t to_uint(std::string_view str) {
    uint32_t result = 0;

    if (str.empty()) return 0;

    for (char c : str) {
        if (c < '0' || c > '9') return result;
        result *= 10;
        result += c - '0';
    }

    return result;
}
```

- Не сообщает нам об ошибке
- Не решает проблему строк начинающихся с цифр
- Не решает проблему пустых строк

## Исключения и код возврата


```cpp
bool to_uint(std::string_view str, uint32_t& result) {
    if (str.empty()) {
        return false;
    }

    for (char c : str) {
        if (c < '0' || c > '9') {
            return false;
        }

        result *= 10;
        result += c - '0';
    }

    return true;
}
```

- Лучше, но не отвечает на вопрос, что случилось

## Исключения и код возврата


```cpp
uint32_t to_uint(std::string_view str) {
    uint32_t result = 0;
    if (str.empty()) {
        errno = EINVAL;
        return result;
    }

    for (char c : str) {
        if (c < '0' || c > '9') {
            errno = EDOM;
            return result;
        }
        result *= 10;
        result += c - '0';
    }

    return result;
}
```

- Решает проблему в стиле С
- через `errno`

## Исключения и код возврата


```cpp
uint32_t to_uint(std::string_view str) {
    uint32_t result = 0;
    if (str.empty()) throw std::invalid_argument("String is empty");

    for (char c : str) {
        if (c < '0' || c > '9')
            throw std::invalid_argument{std::format("Argument {} is not a number", str)};

        result *= 10;
        result += c - '0';
    }

    return result;
}
```

- Проброс исключения

## Исключения и код возврата


```cpp
std::optional<uint32_t> to_uint(std::string_view str) {
    if (str.empty()) return {};
    uint32_t result = 0;

    for (char c : str) {
        if (c < '0' || c > '9') return {};

        result *= 10;
        result += c - '0';
    }

    return result;
}
```

- Похож на вариант с bool, но бросит исключение если не проверить наличие результата

## Исключения и код возврата


```cpp
std::expected<uint32_t, std::invalid_argument> to_uint(std::string_view str) {
    if (str.empty()) return std::unexpected{std::invalid_argument("String is empty")};

    uint32_t result = 0;

    for (char c : str) {
        if (c < '0' || c > '9')
            return std::unexpected{
                std::invalid_argument{std::format("Argument {} is not a number", str)}};

        result *= 10;
        result += c - '0';
    }

    return result;
}
```

- Использует `std::expected`

[godbolt-15-assert-failure]: <https://godbolt.org/#g:!((g:!((h:codeEditor,i:(j:1,lang:c%2B%2B,options:(compileOnChange:'0'),source:'%23include+%3Ccassert%3E%0A%0Aint+main()+%7B%0A++++assert(2+%2B+2+%3D%3D+4)%3B%0A++++assert(2+%2B+2+%3D%3D+5)%3B++//+%D0%9D%D0%B0%D0%BC%D0%B5%D1%80%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5+%D0%B7%D0%B0%D0%B2%D0%B5%D1%80%D1%88%D0%B5%D0%BD%D0%B8%D0%B5+%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D1%8B.%0A%0A++++return+0%3B%0A%7D%0A'),l:'5'),(h:executor,i:(compilationPanelShown:'0',compiler:clang2310,compilerOutShown:'0',lang:c%2B%2B,libs:!(),options:'-std%3Dc%2B%2B20+-O0',source:1,tree:0),l:'5')),l:'2')),version:4>
<!-- godbolt source="examples/15-error-handling/assert-failure.cpp" compiler="clang2310" options="-std=c++20 -O0" -->
