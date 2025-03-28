package mystructs

type UserCredentials struct {
	Name     string `json:"name"`
	Password string `json:"password"`
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
