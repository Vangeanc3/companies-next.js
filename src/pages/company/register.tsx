import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Typography, message } from "antd/lib";

const { Title } = Typography;

const CreateCompany = () => {
  const [loading, setLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isCreated) {
      router.push("/");
    }
  }, [isCreated, router]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a empresa.");
      }

      message.success("Empresa criada com sucesso!");
      setIsCreated(true);
    } catch (err) {
      message.error(err.message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Criar Empresa</Title>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Descrição"
          name="description"
          rules={[
            { required: true, message: "Por favor, insira a descrição." },
          ]}
        >
          <Input placeholder="Descrição da empresa" />
        </Form.Item>

        <Form.Item
          label="CNPJ"
          name="cnpj"
          rules={[{ required: true, message: "Por favor, insira o CNPJ." }]}
        >
          <Input placeholder="CNPJ" />
        </Form.Item>

        <Form.Item
          label="Nome do Contato"
          name="contactName"
          rules={[
            { required: true, message: "Por favor, insira o nome do contato." },
          ]}
        >
          <Input placeholder="Nome do contato" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Criar Empresa
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCompany;
