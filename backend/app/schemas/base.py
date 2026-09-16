from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime
from typing import Optional

class APIModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, #tech_stack to techStack
        populate_by_name=True, #her iki yazımı da kabul et
        from_attributes=True, #ORM nesnesini özniteliklerinden okuyabil
        extra="forbid", #Tanımsız alanları sessizce eleme, 422 döndür
        str_strip_whitespace=True, #gereksiz boşlukları kaldır
    )


class ReadModel(APIModel):
    id: int
    created_at: datetime
    updated_at: datetime
