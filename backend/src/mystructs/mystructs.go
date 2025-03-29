package mystructs

type UserCredentials struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type SignInCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	Id        string `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Password  string `json:"password"`
	CreatedAt any    `json:"createdAt"`
}

type TodoCredentials struct {
	Text      string `json:"text"`
	IsDeleted bool   `json:"isDeleted"`
	IsDone    bool   `json:"isDone"`
}

type Todo struct {
	Id        string `json:"id"`
	Text      string `json:"text"`
	UserId    string `json:"userId"`
	IsDeleted bool   `json:"isDeleted"`
	IsDone    bool   `json:"isDone"`
	CreatedAt any    `json:"createdAt"`
	UpdateAt  any    `json:"updateAt"`
}

type IsDoneValue struct {
	IsDone bool `json:"isDone"`
}

type TextCredential struct {
	Text string `json:"text"`
}
