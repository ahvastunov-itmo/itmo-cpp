---
title: "Лекция 17. Лямбда-выражения"
---

::: {.content-visible unless-format="revealjs"}

[Открыть слайды](slides/17-lambda.html){.btn .btn-outline-primary target="_blank"}

:::

## Язык С++


- Lambda

## Pointer to function


```cpp
int incr(int i) {
    return i + 1;
}

int decr(int i) {
    return i - 1;
}

int main() {
    int (*funcPtr)(int) = incr;

    std::cout << (void*)incr << std::endl;
    std::cout << (void*)funcPtr << std::endl;

    std::cout << (*funcPtr)(1) << std::endl;
    std::cout << funcPtr(1) << std::endl;

    funcPtr = decr;
    std::cout << funcPtr(1) << std::endl;

    return 0;
}
```

- не члены класса
- статические члены класса

## Pointer to function


- int* findMax(int* array, size_t size, bool(*compare)(int,int)) {
```cpp
int* result = array;
for (int i = 1; i < size; ++i) {
    if (!compare(*result, *(array + i))) result = array + i;
}

return result;
}

bool greater(int a, int b) {
    return a > b;
}

int main() {
    int array[] = {1, 4, 5, 3, 10, 9};
    std::cout << *findMax(array, sizeof(array) / sizeof(int), greater);
    return 0;
}
```

- С помощью указателя на функцию параметризируем другую функцию

## Pointer to function


```cpp
using TComparer = bool (*)(int, int)

    int* findMax(int* array, size_t size, TComparer compare) {
    int* result = array;
    for (int i = 1; i < size; ++i) {
        if (!comparer(*result, *(array + i))) result = array + i;
    }

    return result;
}
```

## Functor


```cpp
template <typename TComparer>
int* findMax(int* array, size_t size, TComparer comparer) {
    int* result = array;
    for (int i = 1; i < size; ++i) {
        if (!comparer(*result, *(array + i))) result = array + i;
    }
    return result;
}

int main() {
    int array[] = {1, 4, 5, 3, 10, 9};

    std::cout << *findMax(array, sizeof(array) / sizeof(int), std::greater<int>());
    return 0;
}
```

## Pointer to function


```cpp
void print(int value) {
    std::cout << value << " ";
}

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7};
    std::for_each(v.begin(), v.end(), print);

    return 0;
}
```

## Functor


```cpp
struct Printer {
    void operator()(int value) const {
        std::cout << value << " ";
    }
};

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7};
    std::for_each(v.begin(), v.end(), Printer{});

    return 0;
}
```

- Шаблон позволяет подставить любой callable объект

## Functor


```cpp
struct Printer {
    Printer() : counter(0) {
    }
    void operator()(int value) const {
        std::cout << value << " ";
        ++counter;
    }

    mutable size_t counter;
};

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7};
    Printer p = std::for_each(v.begin(), v.end(), Printer{});
    std::cout << std::endl << p.counter << std::endl;

    return 0;
}
```

## Стандартные функциональные объекты


```cpp
std::less std::equal_to std::plus std::logical_and
```

- Другие функциональные объекты объявлены в `<functional>`

## Functor


```cpp
#include <functional>
#include <iterator>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7};

    std::sort(v.begin(), v.end(), std::greater<int>());
    std::copy(v.begin(), v.end(), std::ostream_iterator<int>(std::cout, " "));

    return 0;
}
```

## Functor


```cpp
class GreaterThan {
   public:
    GreaterThan(int limit) : limit_(limit) {
    }
    bool operator()(int value) const {
        return value > limit_;
    }

   private:
    int limit_;
};

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7};

    auto it = std::find_if(v.begin(), v.end(), GreaterThan{4});

    if (it != v.end()) std::cout << *it;

    return 0;
}
```

## Functor


```cpp
int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7};

    auto it =
        std::find_if(v.begin(), v.end(), std::bind(std::greater<int>{}, std::placeholders::_1, 4));

    if (it != v.end()) std::cout << *it;

    return 0;
}
```

- Частичное применение

## Functor


- Позволяют параметризовать алгоритмы (и обычные функции)
- Отделены от вызывающего кода
- Использование стандартных функторов в нестандартных ситуациях затруднено

## Lambda (C++11)


```cpp
int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7};

    auto it = std::find_if(v.begin(), v.end(),
`[](int value) { return value > 4; }` );

    if (it != v.end()) std::cout << *it;

    return 0;
}
```

## Lambda


- Лямбда создаёт неименованный функциональный объект и может захватывать переменные из текущей области видимости.

```cpp
[capture](parameters) attributes -> return_type { statements }
```

- `parameters`, `attributes` и `return_type` могут отсутствовать
- Тип возвращаемого значения обычно выводится автоматически

## Lambda


```cpp
int x = 1;

[] {};
[](int i) { return i + 1; };
[](int i) -> float { return i + 1; };
[x](int i) { return x + i; };
[](int i) noexcept { return i + 1; };
[&x](int i) mutable {
    ++x;
    return i + x;
};
```

## Lambda


```{.cpp filename="basic-lambda.cpp"}
{{< include examples/17-lambda/basic-lambda.cpp >}}
```

[![](assets/compiler-explorer.svg){.godbolt-link-image width="32"}][godbolt-17-basic-lambda]{aria-label="Open in Compiler Explorer"}

Компилятор создаёт для каждой лямбды отдельный безымянный тип с `operator()`.

- <https://cppinsights.io/>

## Каждая лямбда имеет собственный тип


```{.cpp filename="lambda-types.cpp"}
{{< include examples/17-lambda/lambda-types.cpp >}}
```

[![](assets/compiler-explorer.svg){.godbolt-link-image width="32"}][godbolt-17-lambda-types]{aria-label="Open in Compiler Explorer"}

## Capture


- [x, y] - by value
- [=] - all by value with automatic storage duration
- [&x, &y]  - by reference
- [&] - all by reference with automatic storage duration
- [this] -  by reference current object
- [*this] - by copy current object

## Capture


```cpp
int main() {
    int x = 1;
    int y = 2;

    auto f = [x, &y](int v) { return v + x + y; };
}

int x = 1;
int y = 2;

class __lambda_7_12 {
   public:
    inline int operator()(int v) const {
        return (v + x) + y;
    }

   private:
    int x;
    int& y;

   public:
    __lambda_7_12(int& _x, int& _y) : x{_x}, y{_y} {
    }
};

__lambda_7_12 f = __lambda_7_12{x, y};
```

## Capture


```cpp
struct Foo {
    int field = 0;

    int func(int i) {
        auto f = [this](int value) { return field + value; };

        return f(i);
    }
};

struct Foo {
    int field = 0;
    inline int func(int i) {
        class __lambda_8_16 {
           public:
            inline int operator()(int value) const {
                return __this->field + value;
            }

           private:
            Foo* __this;

           public:
            __lambda_8_16(Foo* _this) : __this{_this} {
            }
        };

        __lambda_8_16 f = __lambda_8_16{this};
        return this->func(i);
    }
};
```

## Capture


```cpp
struct Foo {
    int field = 0;

    int func(int i) {
        auto f = [*this](int value) { return field + value; };
        return f(i);
    }
};

struct Foo {
    int field = 0;
    inline int func(int i) {
        class __lambda_8_16 {
           public:
            inline int operator()(int value) const {
                return (&__this)->field + value;
            }

           private:
            Foo __this;

           public:
            __lambda_8_16(const Foo& _this) : __this{_this} {
            }
        };

        __lambda_8_16 f = __lambda_8_16{*this};
        return this->func(i);
    }
};
```

## Mutable


```cpp
int main() {
    int x = 0;
    auto f = [x]() mutable {
        ++x;
        std::cout << x << std::endl;
    };

    f();
    std::cout << x << std::endl;
    f();
    std::cout << x << std::endl;
}
```

## Immediately Invoked Function


```cpp
int main() {
    []() { std::cout << "ITMO\n"; }();

    int x = 2023;
    [&x]() noexcept { ++x; }();
    std::cout << x << std::endl;

    return 0;
}
```

## Immediately Invoked Function


```cpp
void SomeHardLogic();

struct Foo {
    Foo() {
        SomeHardLogic();
    }
};

Foo createFooA();
Foo createFooB();

int main() {
    Foo f;  // too expensive
    bool someCondition = true;

    if (someCondition) {
        f = createFooA();
    } else {
        f = createFooB();
    }

    return 0;
}
```

## Immediately Invoked Function


```cpp
void SomeHardLogic();

struct Foo {
    Foo() {
        SomeHardLogic();
    }
};

Foo createFooA();
Foo createFooB();

int main() {
    const Foo f;  // compile-time error

    bool someCondition = true;

    if (someCondition) {
        f = createFooA();
    } else {
        f = createFooB();
    }

    return 0;
}
```

## Immediately Invoked Function


```cpp
void SomeHardLogic(int);

struct Foo {
    Foo(int value) {
        SomeHardLogic(value);
    }
};

Foo createFooA();
Foo createFooB();

int main() {
    Foo f;  // compile-time error
    bool someCondition = true;

    if (someCondition) {
        f = createFooA();
    } else {
        f = createFooB();
    }

    return 0;
}
```

## Immediately Invoked Function


```cpp
void SomeHardLogic(int);

struct Foo {
    Foo(int value) {
        SomeHardLogic(value);
    }
};

Foo createFooA();
Foo createFooB();

int main() {
    bool someCondition = true;

    const Foo f = [someCondition]() {
        if (someCondition) {
            return createFooA();
        } else {
            return createFooB();
        }
    }();

    return 0;
}
```

## Immediately Invoked Function


```cpp
void SomeHardLogic(int);

struct Foo {
    Foo(int value) {
        SomeHardLogic(value);
    }
};

Foo createFooA();
Foo createFooB();

int main() {
    bool someCondition = true;

    const Foo f = std::invoke([someCondition]() {
        if (someCondition) {
            return createFooA();
        } else {
            return createFooB();
        }
    });

    return 0;
}
```

## Lambda Inheriting


```cpp
template <typename T, typename U>
struct SimpleOverloader : public T, U {
    SimpleOverloader(T first, U second) : T(first), U(second) {
    }

    using T::operator();
    using U::operator();
};

template <typename T, typename U>
SimpleOverloader<T, U> MakeOverloaded(const T& first, const U& second) {
    return SimpleOverloader<T, U>(first, second);
}

int main() {
    auto overloaded =
        MakeOverloaded([](int) { std::cout << "int\n"; }, [](float) { std::cout << "float\n"; });

    overloaded(1);
    overloaded(1.1F);

    return 0;
}
```

## Bind


```cpp
int threeArgFunc(int x, int y, int z) {
    return x + y + z;
}

int main() {
    auto twoArgFunc = [](int x, int z) { return threeArgFunc(x, 2, z); };
    auto oneArgFunc = [&](int z) { return twoArgFunc(1, z); };

    std::cout << oneArgFunc(3);

    return 0;
}
```

## Generic Lambda


```cpp
int main() {
    const auto f = [](auto x, auto y) { return x + y; };

    std::cout << f(1, 2) << std::endl;
    std::cout << f(1, 2.3) << std::endl;

    std::cout << f(std::string{"abc"}, std::string{"def"}) << std::endl;

    return 0;
}
```

Упрощённое представление типа лямбды:

```cpp
class __lambda_10_19 {
   public:
    template <class T, class U>
    auto operator()(T x, U y) const {
        return x + y;
    }
};
```

## Recursive Lambda


```cpp
int main() {
    const auto factorial = [](int n) noexcept {
        const auto impl = [](int n, const auto& impl) noexcept -> int {
            return n > 1 ? n * impl(n - 1, impl) : 1;
        };
        return impl(n, impl);
    };

    std::cout << factorial(4);

    return 0;
}
```

## Function Pointer & Lambda


```{.cpp filename="lambda-to-function-pointer.cpp"}
{{< include examples/17-lambda/lambda-to-function-pointer.cpp >}}
```

[![](assets/compiler-explorer.svg){.godbolt-link-image width="32"}][godbolt-17-lambda-function-pointer]{aria-label="Open in Compiler Explorer"}

## Array of lambda


```cpp
int main() {
    using TFunc = int (*)(int);

    std::vector<TFunc> v;

    v.push_back([](int i) { return i + 1; });
    v.push_back([](int i) { return i + 2; });
    v.push_back([](int i) { return i + 3; });

    for (auto& f : v) std::cout << f(1) << std::endl;
    return 0;
}
```

## std::function


- Умеет хранить и вызывать
- Функции
- Лямбды
- Функторы
- Методы класса
```cpp
std::bad_function_call
```

## std::function


```cpp
int main() {
    std::function<int(int)> f = Incr{};
    std::function<int(int)> f2 = incr;

    std::function<int(int)> f3 = [](int value) { return value + 1; };

    std::function<int(const Foo&, int)> f4 = &Foo::incr;

    std::cout << f(1) << ' ' << f2(1) << ' ' << f3(1) << ' ' << f4(Foo{}, 1) << std::endl;

    return 0;
}
```

## std::function


- // simple implementation

[godbolt-17-basic-lambda]: <https://godbolt.org/#g:!((g:!((h:codeEditor,i:(j:1,lang:c%2B%2B,options:(compileOnChange:'0'),source:'int+main()+%7B%0A++++auto+is_greater_than_four+%3D+%5B%5D(int+value)+%7B+return+value+%3E+4%3B+%7D%3B%0A%0A++++return+is_greater_than_four(5)+%3F+0+:+1%3B%0A%7D%0A'),l:'5'),(h:executor,i:(compilationPanelShown:'0',compiler:clang2310,compilerOutShown:'0',lang:c%2B%2B,libs:!(),options:'-std%3Dc%2B%2B20+-O0',source:1,tree:0),l:'5')),l:'2')),version:4>
<!-- godbolt source="examples/17-lambda/basic-lambda.cpp" compiler="clang2310" options="-std=c++20 -O0" -->

[godbolt-17-lambda-types]: <https://godbolt.org/#g:!((g:!((h:codeEditor,i:(j:1,lang:c%2B%2B,options:(compileOnChange:'0'),source:'%23include+%3Ctype_traits%3E%0A%0Aint+main()+%7B%0A++++auto+first+%3D+%5B%5D(int+value)+%7B+return+value+%2B+1%3B+%7D%3B%0A++++auto+second+%3D+%5B%5D(int+value)+%7B+return+value+%2B+1%3B+%7D%3B%0A%0A++++static_assert(!!std::is_same_v%3Cdecltype(first),+decltype(second)%3E)%3B%0A%7D%0A'),l:'5'),(h:executor,i:(compilationPanelShown:'0',compiler:clang2310,compilerOutShown:'0',lang:c%2B%2B,libs:!(),options:'-std%3Dc%2B%2B20+-O0',source:1,tree:0),l:'5')),l:'2')),version:4>
<!-- godbolt source="examples/17-lambda/lambda-types.cpp" compiler="clang2310" options="-std=c++20 -O0" -->

[godbolt-17-lambda-function-pointer]: <https://godbolt.org/#g:!((g:!((h:codeEditor,i:(j:1,lang:c%2B%2B,options:(compileOnChange:'0'),source:'int+main()+%7B%0A++++auto+is_greater_than_four+%3D+%5B%5D(int+value)+%7B+return+value+%3E+4%3B+%7D%3B%0A++++bool+(*function_pointer)(int)+%3D+is_greater_than_four%3B%0A%0A++++return+function_pointer(5)+%3F+0+:+1%3B%0A%7D%0A'),l:'5'),(h:executor,i:(compilationPanelShown:'0',compiler:clang2310,compilerOutShown:'0',lang:c%2B%2B,libs:!(),options:'-std%3Dc%2B%2B20+-O0',source:1,tree:0),l:'5')),l:'2')),version:4>
<!-- godbolt source="examples/17-lambda/lambda-to-function-pointer.cpp" compiler="clang2310" options="-std=c++20 -O0" -->
