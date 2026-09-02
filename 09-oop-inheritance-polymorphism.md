---
title: "Лекция 9. Наследование и полиморфизм"
---

::: {.content-visible unless-format="revealjs"}

[Открыть слайды](slides/09-oop-inheritance-polymorphism.html){.btn .btn-outline-primary target="_blank"}

:::

## Язык С++


- ООП. Наследование и Полиморфизм

## Наследование


```cpp
class CPerson {
   public:
    CPerson(const std::string& name, unsigned yearOfBirth)
        : yearOfBirth_(yearOfBirth), name_(name) {
    }

    unsigned age() const {
        const std::chrono::time_point now{std::chrono::system_clock::now()};
        const std::chrono::year_month_day ymd{std::chrono::floor<std::chrono::days>(now)};

        return static_cast<int>(ymd.year()) - yearOfBirth_;
    }
    const std::string& name() const {
        return name_;
    }

   private:
    std::string name_;
    unsigned yearOfBirth_;
};
```

## Наследование


- Позволяет описать новый класс на основе существующего и частично или полностью переиспользовать его функциональность. Исходный класс называют базовым, а новый — производным.
- полиморфизм подтипов, is-a relationship
- Обеспечивает повторное использование кода — это следствие, но не главная причина наследования
- множественное наследование

## Наследование


```cpp
class CStudent : public CPerson {
   public:
    CStudent(const std::string& name, unsigned age, const std::string& university)
        : CPerson(name, age), university_(university) {
    }

   private:
    std::string university_;
};
```

## Наследование


- Наследник:
- Хранит в себе родителя
- Сохраняет методы родителя*
- Приведение к базовому классу (slicing)
- Модификаторы доступа

## Constructor/Destructor order


## Наследование

<!-- embedded-images:start -->
![Изображение 1 со слайда 7](assets/09-oop-inheritance-polymorphism/slide-07-image-01.png)
<!-- embedded-images:end -->


## Наследование


```cpp
class CStudent : public CPerson {
   public:
    CStudent(const std::string& name, unsigned yearOfBirth, const std::string& university)
        : CPerson(name, yearOfBirth), university_(university) {
    }

    const std::string& university() const {
        return university_;
    }

    void Hello() const {
        std::cout << "Hello. I'am " << name() << " I'am from " << university_ << std::endl;
    }

   private:
    std::string university_;
};
```

## Наследование


- // CBudgetStudent is a CStudent. CStudent is a CPerson
```cpp
class CBudgetStudent : public CStudent {
   public:
    CBudgetStudent(const std::string& name, unsigned yearOfBirth, const std::string& university,
                   unsigned salary)
        : CStudent(name, yearOfBirth, university), salary_(salary) {
    }

   private:
    unsigned salary_;
};
```

## is-a relationship


```cpp
void Hello(const CStudent& p) {
    p.Hello();
}

int main() {
    CBudgetStudent st = {"Ivan Ivanov", 2002, "ITMO", 20000};
    Hello(st);
    return 0;
}
```

## Наследование, устройство в памяти


```cpp
int main(int, char**) {
    std::cout << "sizeof(CPerson): " << sizeof(CPerson) << std::endl;
    std::cout << "sizeof(CStudent): " << sizeof(CStudent) << std::endl;
    std::cout << "sizeof(CBudgetStudent): " << sizeof(CBudgetStudent) << std::endl;
}
```

## Иерархия геометрических фигур


- Shape
- Triangle
- Circle
- Square
- Rectangle
- void double_width(Rectangle& r)
```cpp
{
    r.setWidth(r.width * 2);
}
```

## Иерархия геометрических фигур


- Shape
- Triangle
- Circle
- Rectangle
- Square
```cpp
double area(Square& s) {
    return s.width() * s.width();
}
```

## Иерархия геометрических фигур


- Shape
- Triangle
- Circle
- Rectangle
- Square

## Множественное наследование


```cpp
class CEmployee : public CPerson {
   public:
    CEmployee(const std::string& name, int yearOfBirth, unsigned salary)
        : CPerson(name, yearOfBirth), salary_(salary) {
    }

   private:
    unsigned salary_;
};
```

## Множественное наследование


```cpp
class CIntern : public CEmployee, public CBudgetStudent {
   public:
    CIntern(const std::string& name, int yearOfBirth, const std::string& university,
            unsigned universitySalary, unsigned workSalary)
        : CEmployee(name, yearOfBirth, workSalary),
          CBudgetStudent(name, yearOfBirth, university, universitySalary) {
    }
};
```

## Множественное наследование


```cpp
int main(int, char**) {
    std::cout << "sizeof(CPerson): " << sizeof(CPerson) << std::endl;
    std::cout << "sizeof(CStudent): " << sizeof(CStudent) << std::endl;
    std::cout << "sizeof(CBudgetStudent): " << sizeof(CBudgetStudent) << std::endl;

    std::cout << "sizeof(CEmployee): " << sizeof(CEmployee) << std::endl;
    std::cout << "sizeof(CIntern): " << sizeof(CIntern) << std::endl;
}
```

## Diamond Problem


```cpp
int main(int, char**) {
    CIntern intern("Ivan Ivanov", 2002, "ITMO", 20000, 50000);

    intern.Hello();

    // std::cout << intern.name();  compile-time error

    std::cout << intern.CEmployee::name() << std::endl;
    std::cout << intern.CBudgetStudent::name() << std::endl;
    return 0;
}
```

## Проблемы множественного наследования


```cpp
class CEmployee : public CPerson {
   public:
    void IncreaseSalary() {
        salary_ += 1000;
    }

   protected:
    unsigned salary_;
};

class CBudgetStudent : public CStudent {
   public:
    void IncreaseSalary() {
        salary_ += 1000;
    }

   protected:
    unsigned salary_;
};

class CIntern : public CEmployee, public CBudgetStudent {
   public:
    using CEmployee::IncreaseSalary;

    unsigned Salary() const {
        return CEmployee::salary_ + CBudgetStudent::salary_;
    }
};

int main(int, char**) {
    CIntern intern("Ivan Ivanov", 2002, "ITMO", 20000, 50000);

    intern.IncreaseSalary();
    std::cout << intern.Salary() << std::endl;

    return 0;
}
```

## final


## Полиморфизм


- свойство системы, позволяющее использовать объекты с одинаковым интерфейсом без информации о типе и внутренней структуре объекта.

## Динамический полиморфизм


- Позднее и раннее связывание
- Виртуальные функции

## Виртуальные функции


```cpp
class ILogger {
   public:
    virtual void Log(const char* message) {
    }

    virtual ~ILogger() = default;
};

class CConsoleLogger : public ILogger {
   public:
    void Log(const char* message) override {
        std::cout << message << std::endl;
    }
};
```

## Виртуальные функции


```cpp
class CFileLogger : public ILogger {
   public:
    CFileLogger(const char* filename) : stream_(filename) {
    }

    ~CFileLogger() {
        stream_.close();
    }

    CFileLogger(const CFileLogger&) = delete;
    CFileLogger& operator=(const CFileLogger&) = delete;
    void Log(const char* message) override {
        stream_ << message << std::endl;
    }

   private:
    std::ofstream stream_;
}
```

## Таблица виртуальных функций


- Таблица обычно создаётся для класса с виртуальными функциями
- Вызов виртуального метода — это вызов метода по адресу из таблицы
- Стандарт не определяет механизм реализации виртуальных функций, однако большинство компиляторов используют таблицу виртуальных функций

## Таблица виртуальных функций: схема

<!-- embedded-images:start -->
![Изображение 1 со слайда 26](assets/09-oop-inheritance-polymorphism/slide-26-image-01.jpg)
<!-- embedded-images:end -->


## override


```cpp
class ILogger {
   public:
    virtual void Log(const char* message) {
    }

    virtual ~ILogger() = default;
};

class CConsoleLogger : public ILogger {
   public:
    void Log(const char* message) override {
        std::cout << message << std::endl;
    }
};
```

## final


```cpp
class CConsoleLogger : public ILogger {
   public:
    void Log(const char* message) final {
        std::cout << message << std::endl;
    }
};

class CModernConsoleLogger : public CConsoleLogger {
   public:
    void Log(const char* message) override {  // Compile-time error
        std::cout << message;
    }
};
```

## Virtual destructor


```cpp
class Base {
   public:
    Base() {
        std::cout << "Base\n";
    }
    virtual ~Base() {
        std::cout << "~Base\n";
    }
};

class Derived : public Base {
   public:
    Derived() {
        std::cout << "Derived\n";
    }
    ~Derived() {
        std::cout << "~Derived\n";
    }
};

int main(int, char**) {
    Base* d = new Derived;
    delete d;

    return 0;
}
```

## Абстрактный класс


```cpp
class ILogger {
   public:
    virtual void Log(const std::string& msg) = 0;  // pure virtual function
    virtual ~ILogger() = default;
};

int main(int, char**) {
    ILogger log;  // Error : variable type 'ILogger' is an abstract class
    return 0;
}
```

- Класс, экземпляр которого нельзя создать
- Обычно используется в качестве базового класса
- Содержит хотя бы одну чисто виртуальную функцию (`pure virtual function`)

## Коллекции полиморфных объектов


## Non-Virtual Interface  Idiom


```cpp
class Base {
   public:
    void doWork() {
        preWork();
        doWorkImpl();
        postWork();
    }

   protected:
    virtual void doWorkImpl() = 0;

   private:
    void preWork() {
        cout << "Preparing...\n";
    }
    void postWork() {
        cout << "Cleaning up...\n";
    }
};

class Derived : public Base {
   protected:
    void doWorkImpl() override {
        cout << "Doing work in Derived\n";
    }
};
```

## Virtual Friend Function Idiom


```cpp
class Base {
   public:
    virtual ~Base() = default;
    friend std::ostream& operator<<(std::ostream& stream, const Base& value);

   protected:
    virtual void printImpl(std::ostream& stream) const {
        stream << "Base\n";
    }
};

std::ostream& operator<<(std::ostream& stream, const Base& value) {
    value.printImpl(stream);
    return stream;
}
```

## Virtual Friend Function Idiom


```cpp
class Derived : public Base {
   protected:
    void printImpl(std::ostream& stream) const override {
        stream << "Derived\n";
    }
};
```

## Стоимость виртуальных функций


- Лишнее обращение к таблице вместо явного адреса
- Виртуальный вызов может затруднить инлайнинг
- Для коллекций объектов - они всегда в куче
- Порядок объектов также может влиять на скорость

## ООП


- Абстракция
- Инкапсуляция
- Наследование
- Полиморфизм
